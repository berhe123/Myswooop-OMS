const express = require('express');
const router = express.Router();
const Database = require('../db/database');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

const db = new Database();

// Get all allocations for current user
router.get('/', authenticateToken, async (req, res) => {
  try {
    console.log('Fetching allocations for user:', req.user.id, 'username:', req.user.username);
    
    // Find employee linked to current user
    const employee = await db.get(`
      SELECT e.id, e.name FROM employees e
      WHERE e.userId = ?
    `, [req.user.id]);

    console.log('Employee record found:', employee);

    if (!employee) {
      console.log('No employee record found for userId:', req.user.id);
      return res.json([]);
    }

    // Get allocations for this employee
    const allocations = await db.all(`
      SELECT a.id, a.taskType, a.allocatedDate, e.name, e.id as employeeId
      FROM allocations a
      JOIN employees e ON a.employeeId = e.id
      WHERE a.employeeId = ?
      ORDER BY a.allocatedDate DESC
    `, [employee.id]);
    
    console.log('Allocations found for employee:', employee.id, 'count:', allocations.length);
    res.json(allocations);
  } catch (error) {
    console.error('Error fetching allocations:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get allocations for specific employee
router.get('/employee/:employeeId', authenticateToken, async (req, res) => {
  try {
    const allocations = await db.all(`
      SELECT a.id, a.taskType, a.allocatedDate
      FROM allocations a
      WHERE a.employeeId = ?
      ORDER BY a.allocatedDate DESC
    `, [req.params.employeeId]);
    
    res.json(allocations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create allocation (admin only)
router.post('/', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { employeeId, taskType } = req.body;
    console.log('Creating allocation:', { employeeId, taskType });

    // Delete previous allocation for this employee today
    const today = new Date().toISOString().split('T')[0];
    console.log('Today date:', today);
    
    await db.run(`
      DELETE FROM allocations 
      WHERE employeeId = ? AND date(allocatedDate) = ?
    `, [employeeId, today]);

    // Create new allocation
    const result = await db.run(
      'INSERT INTO allocations (employeeId, taskType) VALUES (?, ?)',
      [employeeId, taskType]
    );

    console.log('New allocation created with id:', result.id);

    const allocation = await db.get(`
      SELECT a.id, a.taskType, a.allocatedDate, e.name
      FROM allocations a
      JOIN employees e ON a.employeeId = e.id
      WHERE a.id = ?
    `, [result.id]);

    console.log('Allocation details:', allocation);
    res.json(allocation);
  } catch (error) {
    console.error('Error creating allocation:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete allocation (admin only)
router.delete('/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    await db.run('DELETE FROM allocations WHERE id = ?', [req.params.id]);
    res.json({ message: 'Allocation deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
