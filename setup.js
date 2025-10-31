const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function setup() {
  let tempPool;
  let pool;

  try {
    // Connect without database first
    tempPool = await mysql.createConnection({
      host: '142.91.102.23',
      user: 'imesh',
      password: 'Imesh2001@',
      port: 3306,
    });

    console.log('Creating database...');
    await tempPool.query('CREATE DATABASE IF NOT EXISTS bms_form_submit');
    await tempPool.end();

    // Now connect with database
    pool = await mysql.createConnection({
      host: '142.91.102.23',
      user: 'imesh',
      password: 'Imesh2001@',
      port: 3306,
      database: 'bms_form_submit',
    });

    console.log('Creating tables...');
    
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

    console.log('Checking for existing admin...');
    const [existingAdmin] = await pool.query(
      'SELECT * FROM admins WHERE username = ?',
      ['admin']
    );

    if (existingAdmin.length === 0) {
      console.log('Creating default admin user...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await pool.query(
        'INSERT INTO admins (username, password) VALUES (?, ?)',
        ['admin', hashedPassword]
      );
      console.log('Default admin created!');
      console.log('Username: admin');
      console.log('Password: admin123');
    } else {
      console.log('Admin user already exists.');
    }

    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Setup error:', error);
  } finally {
    if (pool) await pool.end();
  }
}

setup();

