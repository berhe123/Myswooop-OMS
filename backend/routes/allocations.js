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
    const { employeeId, taskType, allocatedDate } = req.body;
    console.log('Creating allocation:', { employeeId, taskType, allocatedDate });

    // Use provided date or default to today
    const dateToUse = allocatedDate ? new Date(allocatedDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    console.log('Allocation date:', dateToUse);
    
    // FIXED: Only delete if updating the SAME task type for this employee on this date
    // This prevents losing other allocations for the same day
    const existing = await db.get(`
      SELECT id FROM allocations 
      WHERE employeeId = ? AND date(allocatedDate) = ? AND taskType = ?
    `, [employeeId, dateToUse, taskType]);

    if (existing) {
      console.log('Updating existing allocation:', existing.id);
      await db.run(
        'UPDATE allocations SET allocatedDate = ? WHERE id = ?',
        [dateToUse, existing.id]
      );
    } else {
      console.log('Creating new allocation (no existing one for this task type)');
      // Create new allocation with explicit date - don't delete other task types!
      await db.run(
        'INSERT INTO allocations (employeeId, taskType, allocatedDate) VALUES (?, ?, ?)',
        [employeeId, taskType, dateToUse]
      );
    }

    // Get the allocation after create/update
    const allocation = await db.get(`
      SELECT a.id, a.taskType, a.allocatedDate, e.name
      FROM allocations a
      JOIN employees e ON a.employeeId = e.id
      WHERE a.employeeId = ? AND a.taskType = ? AND date(a.allocatedDate) = ?
      ORDER BY a.id DESC LIMIT 1
    `, [employeeId, taskType, dateToUse]);

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
