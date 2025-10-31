const mysql = require('mysql2/promise');

async function migrate() {
  const pool = await mysql.createConnection({
    host: '142.91.102.23',
    user: 'imesh',
    password: 'Imesh2001@',
    port: 3306,
    database: 'bms_form_submit'
  });

  try {
    const columns = [
      ['lastName', 'VARCHAR(100)'],
      ['initials', 'VARCHAR(20)'],
      ['bsn', 'VARCHAR(20)'],
      ['street', 'VARCHAR(255)'],
      ['postalCode', 'VARCHAR(20)'],
      ['city', 'VARCHAR(100)'],
      ['country', 'VARCHAR(100)'],
      ['region', 'VARCHAR(100)'],
      ['birthDate', 'VARCHAR(20)'],
      ['applyTaxDeduction', 'VARCHAR(10)'],
      ['taxDeductionDate', 'VARCHAR(20)'],
      ['applySingleParent', 'VARCHAR(10)'],
      ['signatureDate', 'VARCHAR(20)'],
      ['signature', 'TEXT']
    ];

    for (const [colName, colType] of columns) {
      try {
        await pool.query(`ALTER TABLE forms ADD COLUMN ${colName} ${colType}`);
        console.log(`✓ Added column: ${colName}`);
      } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
          console.log(`- Column ${colName} already exists`);
        } else {
          throw err;
        }
      }
    }

    console.log('Database migration completed successfully!');
  } finally {
    await pool.end();
  }
}

migrate().catch(console.error);

