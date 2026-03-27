const express = require('express');
const router = express.Router();
const Database = require('../db/database');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

const db = new Database();

// Get daily products stats
router.get('/daily/:date', authenticateToken, async (req, res) => {
  try {
    const product = await db.get(
      'SELECT * FROM daily_products WHERE date = ?',
      [req.params.date]
    );
    
    if (!product) {
      res.json({ 
        date: req.params.date,
        incoming: 0, 
        tested: 0, 
        sold: 0, 
        repaired: 0,
        returnProducts: 0 
      });
    } else {
      res.json(product);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update daily products (admin only)
router.post('/daily/:date', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { incoming, tested, sold, repaired, returnProducts } = req.body;
    const date = req.params.date;

    const existing = await db.get(
      'SELECT id FROM daily_products WHERE date = ?',
      [date]
    );

    if (existing) {
      await db.run(
        'UPDATE daily_products SET incoming = ?, tested = ?, sold = ?, repaired = ?, returnProducts = ? WHERE date = ?',
        [incoming, tested, sold, repaired, returnProducts, date]
      );
    } else {
      await db.run(
        'INSERT INTO daily_products (date, incoming, tested, sold, repaired, returnProducts) VALUES (?, ?, ?, ?, ?, ?)',
        [date, incoming, tested, sold, repaired, returnProducts]
      );
    }

    const product = await db.get(
      'SELECT * FROM daily_products WHERE date = ?',
      [date]
    );

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit daily product registration (employees)
router.post('/daily-registration', authenticateToken, async (req, res) => {
  try {
    const { date, category, data } = req.body;
    const userId = req.user.id;

    if (!date || !category || !data) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if registration already exists for this user, date, and category
    const existing = await db.get(
      'SELECT id FROM daily_registrations WHERE userId = ? AND date = ? AND category = ?',
      [userId, date, category]
    );

    if (existing) {
      // Update existing registration
      await db.run(
        `UPDATE daily_registrations SET 
          arrivedProducts = ?, soldProducts = ?, testedProducts = ?, bookedProducts = ?,
          totalRepaired = ?, totalReturn = ?
        WHERE userId = ? AND date = ? AND category = ?`,
        [
          data.arrivedProducts || 0,
          data.soldProducts || 0,
          data.testedProducts || 0,
          data.bookedProducts || 0,
          data.totalRepaired || 0,
          data.totalReturn || 0,
          userId,
          date,
          category
        ]
      );
    } else {
      // Insert new registration
      await db.run(
        `INSERT INTO daily_registrations 
          (userId, date, category, arrivedProducts, soldProducts, testedProducts, bookedProducts, totalRepaired, totalReturn)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          date,
          category,
          data.arrivedProducts || 0,
          data.soldProducts || 0,
          data.testedProducts || 0,
          data.bookedProducts || 0,
          data.totalRepaired || 0,
          data.totalReturn || 0
        ]
      );
    }

    res.json({ message: 'Daily registration submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all daily registrations (admin only)
router.get('/registrations/all', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const registrations = await db.all(
      `SELECT dr.*, u.username, e.name as employeeName
       FROM daily_registrations dr
       JOIN users u ON dr.userId = u.id
       LEFT JOIN employees e ON u.id = e.userId
       ORDER BY dr.date DESC, dr.category ASC`
    );
    res.json(registrations || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get daily registrations by date (admin only)
router.get('/registrations/date/:date', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const registrations = await db.all(
      `SELECT dr.*, u.username, e.name as employeeName
       FROM daily_registrations dr
       JOIN users u ON dr.userId = u.id
       LEFT JOIN employees e ON u.id = e.userId
       WHERE dr.date = ?
       ORDER BY dr.category ASC`,
      [req.params.date]
    );
    res.json(registrations || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
