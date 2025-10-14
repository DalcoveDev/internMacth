const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkDatabaseTables() {
  console.log('🔍 Checking database tables...');
  
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'internmatch'
  });

  try {
    // Check if tables exist
    const [tables] = await connection.execute(
      `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
       WHERE TABLE_SCHEMA = ? AND TABLE_TYPE = 'BASE TABLE'`,
      [process.env.DB_NAME || 'internmatch']
    );

    console.log(`📊 Found ${tables.length} tables:`);
    tables.forEach(table => {
      console.log(`   ✅ ${table.TABLE_NAME}`);
    });

    // Check for specific tables
    const expectedTables = ['users', 'companies', 'students', 'internships', 'applications', 'notifications'];
    const existingTableNames = tables.map(t => t.TABLE_NAME);
    
    console.log('\n🔍 Checking required tables:');
    expectedTables.forEach(tableName => {
      if (existingTableNames.includes(tableName)) {
        console.log(`   ✅ ${tableName} - EXISTS`);
      } else {
        console.log(`   ❌ ${tableName} - MISSING`);
      }
    });

    // Check for admin user
    const [adminUsers] = await connection.execute(
      'SELECT COUNT(*) as count FROM users WHERE role = "admin"'
    );
    
    console.log(`\n👤 Admin users: ${adminUsers[0].count}`);

    // Check for skills
    const [skills] = await connection.execute(
      'SELECT COUNT(*) as count FROM skills'
    );
    
    console.log(`🎯 Skills in database: ${skills[0].count}`);

    if (tables.length >= 6) {
      console.log('\n🎉 Database is fully initialized and ready!');
      console.log('✅ All data will be stored in MySQL database');
    } else {
      console.log('\n⚠️  Database tables are not fully created yet');
      console.log('💡 Start the backend server to initialize tables');
    }

  } catch (error) {
    console.error('❌ Error checking tables:', error.message);
  } finally {
    await connection.end();
  }
}

checkDatabaseTables();

