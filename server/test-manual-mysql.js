const mysql = require('mysql2');

// Configuration - Update these values to match your MySQL installation
const config = {
  host: 'localhost',
  port: 3306,
  user: 'root', // Change to your MySQL username
  password: 'your_password', // Change to your MySQL password
  database: 'internmatch'
};

console.log('Testing MySQL connection with config:', config);

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
        console.log('⚠️  Database "internmatch" does not exist yet. You need to create it.');
      }
      
      // Close connection
      connection.end();
      console.log('✅ MySQL connection test completed successfully');
    });
  });
});