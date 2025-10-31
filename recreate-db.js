const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function recreateDatabase() {
  const pool = await mysql.createConnection({
    host: '142.91.102.23',
    user: 'imesh',
    password: 'Imesh2001@',
    port: 3306,
    database: 'bms_form_submit'
  });

  try {
    console.log('Dropping old forms table...');
    await pool.query('DROP TABLE IF EXISTS forms');
    console.log('✓ Dropped old table');

    console.log('Creating new forms table with correct schema...');
    await pool.query(`
      CREATE TABLE forms (
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
    console.log('✓ Created new table with correct schema');

    console.log('Database recreated successfully!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

recreateDatabase();

