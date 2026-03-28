const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

class Database {
  constructor() {
    this.db = new sqlite3.Database(path.join(__dirname, 'myswooop.db'));
  }

  init() {
    this.db.serialize(() => {
      // Users table (admin and employees)
      this.db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          email TEXT,
          role TEXT NOT NULL,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Employees table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS employees (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId INTEGER,
          name TEXT NOT NULL,
          email TEXT,
          phone TEXT,
          department TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(userId) REFERENCES users(id)
        )
      `);

      // Task allocations
      this.db.run(`
        CREATE TABLE IF NOT EXISTS allocations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          employeeId INTEGER NOT NULL,
          taskType TEXT NOT NULL,
          allocatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(employeeId) REFERENCES employees(id)
        )
      `);

      // Daily products tracking
      this.db.run(`
        CREATE TABLE IF NOT EXISTS daily_products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          date DATE DEFAULT CURRENT_DATE,
          incoming INTEGER DEFAULT 0,
          tested INTEGER DEFAULT 0,
          sold INTEGER DEFAULT 0,
          repaired INTEGER DEFAULT 0,
          returnProducts INTEGER DEFAULT 0,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(date)
        )
      `);

      // Employee daily product registrations
      this.db.run(`
        CREATE TABLE IF NOT EXISTS daily_registrations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId INTEGER NOT NULL,
          date DATE NOT NULL,
          category TEXT NOT NULL,
          arrivedProducts INTEGER DEFAULT 0,
          soldProducts INTEGER DEFAULT 0,
          testedProducts INTEGER DEFAULT 0,
          bookedProducts INTEGER DEFAULT 0,
          totalRepaired INTEGER DEFAULT 0,
          totalReturn INTEGER DEFAULT 0,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(userId) REFERENCES users(id)
        )
      `);

      // Create admin user
      const hashedPassword = bcrypt.hashSync('admin', 10);
      this.db.run(`
        INSERT OR IGNORE INTO users (username, password, email, role)
        VALUES ('admin', ?, 'admin@myswooop.com', 'admin')
      `, [hashedPassword]);

      console.log('Database initialized successfully');
    });
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    });
  }

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

module.exports = Database;
