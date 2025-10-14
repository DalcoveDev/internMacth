const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'internmatch',
};

async function checkUsers() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    console.log('🔍 Checking users in database...');
    
    const [users] = await connection.execute('SELECT id, name, email, role FROM users');
    
    if (users.length === 0) {
      console.log('📝 No users found in database');
    } else {
      console.log(`👥 Found ${users.length} user(s):`);
      users.forEach(user => {
        console.log(`  - ID: ${user.id}, Name: ${user.name}, Email: ${user.email}, Role: ${user.role}`);
      });
    }
    
    await connection.end();
  } catch (error) {
    console.error('❌ Error checking users:', error.message);
  }
}

checkUsers();