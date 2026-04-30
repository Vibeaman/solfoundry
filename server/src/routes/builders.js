const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all builders
router.get('/', async (req, res) => {
  try {
    const { skill, limit = 20, offset = 0 } = req.query;

    let query = `
      SELECT u.*, 
             COUNT(DISTINCT b.id) as total_bids,
             COUNT(DISTINCT CASE WHEN b.status = 'accepted' THEN b.id END) as projects_won,
             AVG(CASE WHEN r.rating IS NOT NULL THEN r.rating END) as avg_rating
      FROM users u
      LEFT JOIN bids b ON u.id = b.builder_id
      LEFT JOIN reviews r ON u.id = r.builder_id
      WHERE u.role = 'builder'
    `;
    const params = [];
    let paramIndex = 1;

    if (skill) {
      query += ` AND $${paramIndex++} = ANY(u.skills)`;
      params.push(skill);
    }

    query += ` GROUP BY u.id ORDER BY avg_rating DESC NULLS LAST`;
    query += ` LIMIT $${paramIndex++} OFFSET $${paramIndex}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching builders:', err);
    res.status(500).json({ error: 'Failed to fetch builders' });
  }
});

// Get builder profile
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT u.*,
             COUNT(DISTINCT CASE WHEN b.status = 'accepted' THEN b.id END) as projects_completed,
             AVG(r.rating) as avg_rating
      FROM users u
      LEFT JOIN bids b ON u.id = b.builder_id
      LEFT JOIN reviews r ON u.id = r.builder_id
      WHERE u.id = $1
      GROUP BY u.id
    `, [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Builder not found' });
    }

    // Get recent completed projects
    const projects = await db.query(`
      SELECT i.id, i.title, i.category, b.proposed_cost, b.completed_at
      FROM bids b
      JOIN ideas i ON b.idea_id = i.id
      WHERE b.builder_id = $1 AND b.status = 'completed'
      ORDER BY b.completed_at DESC
      LIMIT 5
    `, [req.params.id]);

    res.json({ ...result.rows[0], recent_projects: projects.rows });
  } catch (err) {
    console.error('Error fetching builder:', err);
    res.status(500).json({ error: 'Failed to fetch builder' });
  }
});

module.exports = router;
