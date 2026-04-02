const express = require('express');
const cors = require('cors');
const path = require('path');

// Use PostgreSQL if DATABASE_URL is set, otherwise SQLite
let Database;
if (process.env.DATABASE_URL) {
  console.log('🔗 Using PostgreSQL database');
  Database = require('./db/database-postgresql');
} else {
  console.log('📁 Using SQLite database');
  Database = require('./db/database');
}

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
    const allocations = await db.all('SELECT id, employeeId, taskType, allocatedDate FROM allocations', []);
    const employees = await db.all('SELECT id, userId, name FROM employees', []);
    const registrations = await db.all('SELECT id, userId, date, category FROM daily_registrations ORDER BY date DESC LIMIT 10', []);
    
    res.json({
      allocations: allocations || [],
      employees: employees || [],
      registrations: registrations || [],
      status: 'Database data retrieved',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Reinitialize admin user endpoint
app.get('/api/debug/reinit-admin', async (req, res) => {
  try {
    const bcrypt = require('bcryptjs');
    const hashedPassword = bcrypt.hashSync('admin', 10);
    
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
        password: 'admin'
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
