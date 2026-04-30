const express = require('express');
const router = express.Router();
const db = require('../db');
const { v4: uuidv4 } = require('uuid');

// Get bids for an idea
router.get('/idea/:ideaId', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT b.*, u.display_name as builder_name, u.wallet_address as builder_wallet,
             u.skills, u.portfolio_url
      FROM bids b
      JOIN users u ON b.builder_id = u.id
      WHERE b.idea_id = $1
      ORDER BY b.proposed_cost ASC
    `, [req.params.ideaId]);

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching bids:', err);
    res.status(500).json({ error: 'Failed to fetch bids' });
  }
});

// Create bid
router.post('/', async (req, res) => {
  try {
    const { 
      idea_id, 
      builder_id, 
      proposed_cost, 
      timeline_days, 
      approach,
      why_me 
    } = req.body;

    // Check if builder already bid on this idea
    const existing = await db.query(
      'SELECT id FROM bids WHERE idea_id = $1 AND builder_id = $2',
      [idea_id, builder_id]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'You already submitted a bid for this idea' });
    }

    const id = uuidv4();
    const result = await db.query(`
      INSERT INTO bids (id, idea_id, builder_id, proposed_cost, timeline_days, approach, why_me, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
      RETURNING *
    `, [id, idea_id, builder_id, proposed_cost, timeline_days, approach, why_me]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating bid:', err);
    res.status(500).json({ error: 'Failed to create bid' });
  }
});

// Accept bid (thinker action)
router.post('/:id/accept', async (req, res) => {
  try {
    const { escrow_tx } = req.body;

    // Update bid status
    const bidResult = await db.query(`
      UPDATE bids SET status = 'accepted', escrow_tx = $2, accepted_at = NOW()
      WHERE id = $1
      RETURNING *
    `, [req.params.id, escrow_tx]);

    if (bidResult.rows.length === 0) {
      return res.status(404).json({ error: 'Bid not found' });
    }

    const bid = bidResult.rows[0];

    // Update idea status
    await db.query(`
      UPDATE ideas SET status = 'matched', selected_builder_id = $2, updated_at = NOW()
      WHERE id = $1
    `, [bid.idea_id, bid.builder_id]);

    // Reject other bids
    await db.query(`
      UPDATE bids SET status = 'rejected'
      WHERE idea_id = $1 AND id != $2
    `, [bid.idea_id, req.params.id]);

    res.json(bid);
  } catch (err) {
    console.error('Error accepting bid:', err);
    res.status(500).json({ error: 'Failed to accept bid' });
  }
});

// Complete bid (after work delivered)
router.post('/:id/complete', async (req, res) => {
  try {
    const { release_tx } = req.body;

    const result = await db.query(`
      UPDATE bids SET status = 'completed', release_tx = $2, completed_at = NOW()
      WHERE id = $1
      RETURNING *
    `, [req.params.id, release_tx]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Bid not found' });
    }

    // Update idea status
    await db.query(`
      UPDATE ideas SET status = 'completed', updated_at = NOW()
      WHERE id = $1
    `, [result.rows[0].idea_id]);

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error completing bid:', err);
    res.status(500).json({ error: 'Failed to complete bid' });
  }
});

module.exports = router;
