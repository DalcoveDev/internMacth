const mysql = require('mysql2/promise');
require('dotenv').config();

async function testDatabaseConnection() {
  console.log('🔍 Testing database connection...');
  
  // Database configuration
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'internmatch',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true,
    charset: 'utf8mb4'
  };

  console.log('📋 Database Configuration:');
  console.log(`   Host: ${dbConfig.host}`);
  console.log(`   Port: ${dbConfig.port}`);
  console.log(`   User: ${dbConfig.user}`);
  console.log(`   Database: ${dbConfig.database}`);
  console.log(`   Password: ${dbConfig.password ? '***' : 'Not set'}`);

  try {
    // Test connection without database first
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password
    });

    console.log('✅ MySQL server connection successful!');

    // Check if database exists
    const [databases] = await connection.execute(
      `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`,
      [dbConfig.database]
    );

    if (databases.length === 0) {
      console.log(`❌ Database '${dbConfig.database}' does not exist.`);
      console.log('📝 To create the database, run:');
      console.log(`   CREATE DATABASE ${dbConfig.database};`);
    } else {
      console.log(`✅ Database '${dbConfig.database}' exists!`);
    }

    await connection.end();

    // Test connection with database
    const dbConnection = await mysql.createConnection(dbConfig);
    console.log('✅ Database connection successful!');
    await dbConnection.end();

    console.log('\n🎉 Database is ready for use!');
    return true;

  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error(`   Error: ${error.message}`);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Possible solutions:');
      console.log('   1. Make sure MySQL server is running');
      console.log('   2. Check if MySQL is installed');
      console.log('   3. Verify the host and port settings');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 Possible solutions:');
      console.log('   1. Check username and password');
      console.log('   2. Verify user has proper permissions');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('\n💡 Possible solutions:');
      console.log('   1. Create the database first');
      console.log('   2. Check database name spelling');
    }

    return false;
  }
}

// Run the test
testDatabaseConnection().then((success) => {
  if (success) {
    console.log('\n✅ Database connection test completed successfully!');
    process.exit(0);
  } else {
    console.log('\n❌ Database connection test failed!');
    process.exit(1);
  }
}).catch((error) => {
  console.error('💥 Unexpected error:', error);
  process.exit(1);
});