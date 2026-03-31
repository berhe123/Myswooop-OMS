const express = require('express');
const router = express.Router();
const Database = require('../db/database');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

const db = new Database();

// Get ALL allocations (admin debug endpoint)
router.get('/debug/all-allocations', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const allocations = await db.all(`
      SELECT a.id, a.employeeId, a.taskType, a.allocatedDate, e.name, e.id as empId
      FROM allocations a
      JOIN employees e ON a.employeeId = e.id
      ORDER BY a.allocatedDate DESC
    `);
    res.json({
      count: allocations ? allocations.length : 0,
      allocations: allocations || [],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching all allocations:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get allocations for a specific date (admin only)
router.get('/date/:date', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { date } = req.params;
    console.log('Fetching allocations for date:', date);
    
    const allocations = await db.all(`
      SELECT a.id, a.employeeId, a.taskType, a.allocatedDate, e.name
      FROM allocations a
      JOIN employees e ON a.employeeId = e.id
      WHERE date(a.allocatedDate) = ?
      ORDER BY a.taskType, e.name
    `, [date]);
    
    console.log(`Found ${allocations ? allocations.length : 0} allocations for date ${date}`);
    res.json(allocations || []);
  } catch (error) {
    console.error('Error fetching allocations by date:', error);
    res.status(500).json({ error: error.message });
  }
});

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

    // Store full ISO datetime to ensure consistency
    const fullDateTime = allocatedDate || new Date().toISOString();
    const dateOnly = fullDateTime.split('T')[0]; // Extract date part YYYY-MM-DD
    
    console.log('Full datetime:', fullDateTime);
    console.log('Date only:', dateOnly);
    
    // Check if allocation already exists for same employee, task type, and date
    const existing = await db.get(`
      SELECT id FROM allocations 
      WHERE employeeId = ? AND taskType = ? AND date(allocatedDate) = ?
    `, [employeeId, taskType, dateOnly]);

    if (existing) {
      console.log('Allocation already exists for this employee/task/date. Updating timestamp...');
      await db.run(
        'UPDATE allocations SET allocatedDate = ? WHERE id = ?',
        [fullDateTime, existing.id]
      );
    } else {
      console.log('Creating new allocation (fresh entry)');
      // Create new allocation - store full ISO datetime
      await db.run(
        'INSERT INTO allocations (employeeId, taskType, allocatedDate) VALUES (?, ?, ?)',
        [employeeId, taskType, fullDateTime]
      );
    }

    // VERIFY the allocation was actually created/updated
    const allocation = await db.get(`
      SELECT a.id, a.taskType, a.allocatedDate, e.name
      FROM allocations a
      JOIN employees e ON a.employeeId = e.id
      WHERE a.employeeId = ? AND a.taskType = ? AND date(a.allocatedDate) = ?
      ORDER BY a.id DESC LIMIT 1
    `, [employeeId, taskType, dateOnly]);

    if (allocation) {
      console.log('✅ Allocation verified in database:', allocation);
      res.json(allocation);
    } else {
      console.error('❌ ERROR: Allocation was not found after creation!');
      res.status(500).json({ error: 'Allocation creation failed - not found in database' });
    }
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
