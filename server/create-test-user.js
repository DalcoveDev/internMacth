const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'internmatch',
};

async function createTestUser() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    console.log('🔍 Creating test user...');
    
    const email = 'testuser@example.com';
    const password = 'password123';
    const name = 'Test User';
    const role = 'admin';
    
    // Check if user already exists
    const [existingUsers] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    
    if (existingUsers.length > 0) {
      console.log('📝 User already exists. Deleting existing user...');
      await connection.execute('DELETE FROM users WHERE email = ?', [email]);
    }
    
    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create user
    const [result] = await connection.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );
    
    const userId = result.insertId;
    
    console.log(`✅ Test user created successfully!`);
    console.log(`   ID: ${userId}`);
    console.log(`   Name: ${name}`);
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password} (plain text)`);
    console.log(`   Role: ${role}`);
    
    await connection.end();
  } catch (error) {
    console.error('❌ Error creating test user:', error.message);
  }
}

createTestUser();