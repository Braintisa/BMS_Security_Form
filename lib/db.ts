import mysql from 'mysql2/promise';

// Initialize database and tables
export async function initDatabase() {
  try {
    // First connect without selecting a database
    const tempPool = mysql.createPool({
      host: '142.91.102.23',
      user: 'imesh',
      password: 'Imesh2001@',
      port: 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Create database if not exists
    await tempPool.query('CREATE DATABASE IF NOT EXISTS bms_form_submit');
    await tempPool.end();

    // Now create pool with database
    const pool = mysql.createPool({
      host: '142.91.102.23',
      user: 'imesh',
      password: 'Imesh2001@',
      port: 3306,
      database: 'bms_form_submit',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Create admins table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create forms table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS forms (
        id INT AUTO_INCREMENT PRIMARY KEY,
        -- Section 1: Personal Information (Uw gegevens)
        lastName VARCHAR(100),
        initials VARCHAR(20),
        bsn VARCHAR(20),
        street VARCHAR(255),
        postalCode VARCHAR(20),
        city VARCHAR(100),
        country VARCHAR(100),
        region VARCHAR(100),
        birthDate VARCHAR(20),
        -- Section 2: Tax Deduction (Loonheffingskorting)
        applyTaxDeduction VARCHAR(10),
        taxDeductionDate VARCHAR(20),
        applySingleParent VARCHAR(10),
        -- Section 3: Signature (Ondertekening)
        signatureDate VARCHAR(20),
        signature TEXT,
        -- PDF Attachment (optional)
        pdf_path VARCHAR(255),
        -- Metadata
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(20) DEFAULT 'pending'
      )
    `);

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        form_id INT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (form_id) REFERENCES forms(id) ON DELETE SET NULL
      )
    `);

    // Create default admin (username: admin, password: admin123)
    const [existingAdmin] = await pool.query(
      'SELECT * FROM admins WHERE username = ?',
      ['admin']
    ) as any[];

    if (existingAdmin.length === 0) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await pool.query(
        'INSERT INTO admins (username, password) VALUES (?, ?)',
        ['admin', hashedPassword]
      );
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

const pool = mysql.createPool({
  host: '142.91.102.23',
  user: 'imesh',
  password: 'Imesh2001@',
  port: 3306,
  database: 'bms_form_submit',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;

