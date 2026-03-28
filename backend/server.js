const express = require('express');
const cors = require('cors');
const path = require('path');
const Database = require('./db/database');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
const db = new Database();
db.init();

// Routes
const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employees');
const allocationRoutes = require('./routes/allocations');
const productRoutes = require('./routes/products');

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/allocations', allocationRoutes);
app.use('/api/products', productRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Debug endpoint - view all database data
app.get('/api/debug/data', async (req, res) => {
  try {
    const Database = require('./db/database');
    const debugDb = new Database();
    
    const users = await debugDb.all('SELECT id, username, role, email FROM users', []);
    const employees = await debugDb.all('SELECT id, userId, name, email, phone FROM employees', []);
    const allocations = await debugDb.all('SELECT id, employeeId, taskType, allocatedDate FROM allocations', []);
    
    res.json({
      users: users || [],
      employees: employees || [],
      allocations: allocations || [],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Reinitialize admin user endpoint
app.post('/api/debug/reinit-admin', async (req, res) => {
  try {
    const bcrypt = require('bcryptjs');
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    
    // Delete existing admin if any
    await db.run('DELETE FROM users WHERE username = ?', ['admin']);
    
    // Create fresh admin user
    const result = await db.run(
      'INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)',
      ['admin', hashedPassword, 'admin@myswooop.com', 'admin']
    );
    
    res.json({ 
      success: true, 
      message: 'Admin user reinitialized',
      credentials: {
        username: 'admin',
        password: 'admin123'
      }
    });
  } catch (error) {
    console.error('Reinit admin error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
