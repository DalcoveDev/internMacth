const mysql = require('mysql2');

// Configuration for XAMPP default settings
const config = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '', // XAMPP default has no password
  database: 'internmatch'
};

console.log('Testing MySQL connection with XAMPP config:', config);

// Create connection
const connection = mysql.createConnection(config);

// Test connection
connection.connect((err) => {
  if (err) {
    console.error('❌ Error connecting to MySQL:', err.stack);
    process.exit(1);
  }
  console.log('✅ Connected to MySQL as id ' + connection.threadId);
  
  // Test query
  connection.query('SELECT 1 + 1 AS solution', (error, results, fields) => {
    if (error) {
      console.error('❌ Error executing query:', error.stack);
      connection.end();
      process.exit(1);
    }
    console.log('✅ Test query result:', results[0].solution);
    
    // Check if database exists
    connection.query('SHOW DATABASES LIKE "internmatch"', (error, results, fields) => {
      if (error) {
        console.error('❌ Error checking database:', error.stack);
        connection.end();
        process.exit(1);
      }
      
      if (results.length > 0) {
        console.log('✅ Database "internmatch" exists');
      } else {
        console.log('⚠️  Database "internmatch" does not exist yet. Please create it using phpMyAdmin.');
        console.log('   1. Open http://localhost/phpmyadmin');
        console.log('   2. Click "New" in the left sidebar');
        console.log('   3. Enter "internmatch" as database name');
        console.log('   4. Click "Create"');
      }
      
      // Close connection
      connection.end();
      console.log('✅ XAMPP MySQL connection test completed successfully');
    });
  });
});