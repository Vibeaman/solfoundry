const express = require('express');
const router = express.Router();
const db = require('../db');
const { v4: uuidv4 } = require('uuid');

// Get all ideas (with filters)
router.get('/', async (req, res) => {
  try {
    const { category, status, limit = 20, offset = 0 } = req.query;
    
    let query = `
      SELECT i.*, u.display_name as thinker_name, u.wallet_address as thinker_wallet,
             COUNT(b.id) as bid_count
      FROM ideas i
      JOIN users u ON i.thinker_id = u.id
      LEFT JOIN bids b ON i.id = b.idea_id
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (category) {
      query += ` AND i.category = $${paramIndex++}`;
      params.push(category);
    }
    if (status) {
      query += ` AND i.status = $${paramIndex++}`;
      params.push(status);
    }

    query += ` GROUP BY i.id, u.display_name, u.wallet_address`;
    query += ` ORDER BY i.created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching ideas:', err);
    res.status(500).json({ error: 'Failed to fetch ideas' });
  }
});

// Get single idea
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT i.*, u.display_name as thinker_name, u.wallet_address as thinker_wallet
      FROM ideas i
      JOIN users u ON i.thinker_id = u.id
      WHERE i.id = $1
    `, [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    // Get bids for this idea
    const bids = await db.query(`
      SELECT b.*, u.display_name as builder_name, u.wallet_address as builder_wallet
      FROM bids b
      JOIN users u ON b.builder_id = u.id
      WHERE b.idea_id = $1
      ORDER BY b.proposed_cost ASC
    `, [req.params.id]);

    res.json({ ...result.rows[0], bids: bids.rows });
  } catch (err) {
    console.error('Error fetching idea:', err);
    res.status(500).json({ error: 'Failed to fetch idea' });
  }
});

// Create idea
router.post('/', async (req, res) => {
  try {
    const { 
      thinker_id, 
      title, 
      problem, 
      solution, 
      category, 
      budget_min, 
      budget_max,
      timeline_days,
      assets_url 
    } = req.body;

    const id = uuidv4();
    const result = await db.query(`
      INSERT INTO ideas (id, thinker_id, title, problem, solution, category, budget_min, budget_max, timeline_days, assets_url, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'posted')
      RETURNING *
    `, [id, thinker_id, title, problem, solution, category, budget_min, budget_max, timeline_days, assets_url]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating idea:', err);
    res.status(500).json({ error: 'Failed to create idea' });
  }
});

// Update idea status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, selected_builder_id } = req.body;
    
    const updates = ['status = $2', 'updated_at = NOW()'];
    const params = [req.params.id, status];
    
    if (selected_builder_id) {
      updates.push('selected_builder_id = $3');
      params.push(selected_builder_id);
    }

    const result = await db.query(`
      UPDATE ideas SET ${updates.join(', ')}
      WHERE id = $1
      RETURNING *
    `, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating idea:', err);
    res.status(500).json({ error: 'Failed to update idea' });
  }
});

module.exports = router;
