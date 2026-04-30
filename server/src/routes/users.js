const express = require('express');
const router = express.Router();
const db = require('../db');
const { v4: uuidv4 } = require('uuid');

// Get or create user by wallet
router.post('/auth', async (req, res) => {
  try {
    const { wallet_address, signature } = req.body;

    // TODO: Verify signature in production
    
    // Check if user exists
    let result = await db.query(
      'SELECT * FROM users WHERE wallet_address = $1',
      [wallet_address]
    );

    if (result.rows.length === 0) {
      // Create new user
      const id = uuidv4();
      result = await db.query(`
        INSERT INTO users (id, wallet_address, display_name, role)
        VALUES ($1, $2, $3, 'thinker')
        RETURNING *
      `, [id, wallet_address, `user_${wallet_address.slice(0, 6)}`]);
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error authenticating user:', err);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Update user profile
router.patch('/:id', async (req, res) => {
  try {
    const { display_name, bio, role, skills, portfolio_url, github_url, twitter_url } = req.body;
    
    const updates = [];
    const params = [req.params.id];
    let paramIndex = 2;

    if (display_name) {
      updates.push(`display_name = $${paramIndex++}`);
      params.push(display_name);
    }
    if (bio !== undefined) {
      updates.push(`bio = $${paramIndex++}`);
      params.push(bio);
    }
    if (role) {
      updates.push(`role = $${paramIndex++}`);
      params.push(role);
    }
    if (skills) {
      updates.push(`skills = $${paramIndex++}`);
      params.push(skills);
    }
    if (portfolio_url !== undefined) {
      updates.push(`portfolio_url = $${paramIndex++}`);
      params.push(portfolio_url);
    }
    if (github_url !== undefined) {
      updates.push(`github_url = $${paramIndex++}`);
      params.push(github_url);
    }
    if (twitter_url !== undefined) {
      updates.push(`twitter_url = $${paramIndex++}`);
      params.push(twitter_url);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push('updated_at = NOW()');

    const result = await db.query(`
      UPDATE users SET ${updates.join(', ')}
      WHERE id = $1
      RETURNING *
    `, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Get user profile
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM users WHERE id = $1', [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

module.exports = router;
