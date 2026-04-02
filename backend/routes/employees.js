const express = require('express');
const bcrypt = require('bcryptjs');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

// IMPORTANT: This function receives the database instance from server.js
module.exports = function(db) {
  const router = express.Router();

// Get all employees
router.get('/', authenticateToken, async (req, res) => {
  try {
    const employees = await db.all(`
      SELECT e.id, e.name, e.email, e.phone, e.department, u.username
      FROM employees e
      LEFT JOIN users u ON e.userId = u.id
      ORDER BY e.name
    `);
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get employee by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const employee = await db.get(`
      SELECT e.*, u.username FROM employees e
      LEFT JOIN users u ON e.userId = u.id
      WHERE e.id = ?
    `, [req.params.id]);
    
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create employee (admin only)
router.post('/', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { name, email, phone, username, password } = req.body;

    // Validate required fields
    if (!name || !email || !username || !password) {
      return res.status(400).json({ error: 'Name, email, username, and password are required' });
    }

    // Check if username already exists
    const existingUser = await db.get('SELECT id FROM users WHERE username = ?', [username]);
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists. Please choose a different username.' });
    }

    // Create user account
    const hashedPassword = bcrypt.hashSync(password, 10);
    const userResult = await db.run(
      'INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)',
      [username, hashedPassword, email, 'employee']
    );

    // Create employee record
    const employeeResult = await db.run(
      'INSERT INTO employees (userId, name, email, phone) VALUES (?, ?, ?, ?)',
      [userResult.id, name, email, phone]
    );

    res.json({ 
      id: employeeResult.id, 
      name, 
      email, 
      phone, 
      username 
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update employee (admin only)
router.put('/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    console.log('Updating employee:', req.params.id, { name, email, phone });
    
    await db.run(
      'UPDATE employees SET name = ?, email = ?, phone = ? WHERE id = ?',
      [name, email, phone, req.params.id]
    );

    const employee = await db.get('SELECT * FROM employees WHERE id = ?', [req.params.id]);
    console.log('Employee updated:', employee);
    res.json(employee);
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete employee (admin only)
router.delete('/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    console.log('Deleting employee:', req.params.id);
    const employee = await db.get('SELECT userId FROM employees WHERE id = ?', [req.params.id]);
    console.log('Found employee with userId:', employee?.userId);
    
    if (employee && employee.userId) {
      console.log('Deleting user:', employee.userId);
      await db.run('DELETE FROM users WHERE id = ?', [employee.userId]);
    }
    
    await db.run('DELETE FROM employees WHERE id = ?', [req.params.id]);
    console.log('Employee deleted successfully');
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ error: error.message });
  }
});

  return router;
};
