const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

class Database {
  constructor() {
    // Use DATABASE_URL from environment (set automatically by Render)
    // or use connection string with credentials
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable not set. Please add PostgreSQL connection string in Render.');
    }

    this.pool = new Pool({
      connectionString: connectionString,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    this.pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
    });
  }

  async init() {
    console.log('Initializing PostgreSQL database...');
    
    try {
      // Create tables sequentially - wait for each to complete
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          email TEXT,
          role TEXT NOT NULL,
          "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS employees (
          id SERIAL PRIMARY KEY,
          "userId" INTEGER REFERENCES users(id) ON DELETE CASCADE,
          name TEXT NOT NULL,
          email TEXT,
          phone TEXT,
          department TEXT,
          "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS allocations (
          id SERIAL PRIMARY KEY,
          "employeeId" INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
          "taskType" TEXT NOT NULL,
          "allocatedDate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS daily_products (
          id SERIAL PRIMARY KEY,
          date DATE DEFAULT CURRENT_DATE,
          incoming INTEGER DEFAULT 0,
          tested INTEGER DEFAULT 0,
          sold INTEGER DEFAULT 0,
          repaired INTEGER DEFAULT 0,
          "returnProducts" INTEGER DEFAULT 0,
          "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(date)
        )
      `);

      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS daily_registrations (
          id SERIAL PRIMARY KEY,
          "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          date DATE NOT NULL,
          category TEXT NOT NULL,
          "arrivedProducts" INTEGER DEFAULT 0,
          "soldProducts" INTEGER DEFAULT 0,
          "testedProducts" INTEGER DEFAULT 0,
          "bookedProducts" INTEGER DEFAULT 0,
          "totalRepaired" INTEGER DEFAULT 0,
          "totalReturn" INTEGER DEFAULT 0,
          "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create admin user if not exists
      const hashedPassword = bcrypt.hashSync('admin', 10);
      await this.pool.query(
        `INSERT INTO users (username, password, email, role) 
         VALUES ($1, $2, $3, $4) 
         ON CONFLICT (username) DO NOTHING`,
        ['admin', hashedPassword, 'admin@myswooop.com', 'admin']
      );

      console.log('✅ PostgreSQL database initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing database:', error);
      throw error;
    }
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      // Convert SQLite parameter style (?) to PostgreSQL ($1, $2, etc)
      let pgSql = sql;
      let paramIndex = 1;
      pgSql = pgSql.replace(/\?/g, () => `$${paramIndex++}`);

      this.pool.query(pgSql, params, (err, result) => {
        if (err) {
          console.error('Database error:', err);
          reject(err);
        } else {
          resolve({ 
            id: result.rows[0]?.id || null, 
            changes: result.rowCount 
          });
        }
      });
    });
  }

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      // Convert SQLite parameter style (?) to PostgreSQL ($1, $2, etc)
      let pgSql = sql;
      let paramIndex = 1;
      pgSql = pgSql.replace(/\?/g, () => `$${paramIndex++}`);

      this.pool.query(pgSql, params, (err, result) => {
        if (err) {
          console.error('Database error:', err);
          reject(err);
        } else {
          resolve(result.rows[0] || null);
        }
      });
    });
  }

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      // Convert SQLite parameter style (?) to PostgreSQL ($1, $2, etc)
      let pgSql = sql;
      let paramIndex = 1;
      pgSql = pgSql.replace(/\?/g, () => `$${paramIndex++}`);

      this.pool.query(pgSql, params, (err, result) => {
        if (err) {
          console.error('Database error:', err);
          reject(err);
        } else {
          resolve(result.rows || []);
        }
      });
    });
  }

  close() {
    return this.pool.end();
  }
}

module.exports = Database;
