const mysql = require('mysql2');

// Create connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'user',
  password: 'password',
  database: 'internmatch'
});

// Test connection
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + connection.threadId);
  
  // Test query
  connection.query('SELECT 1 + 1 AS solution', (error, results, fields) => {
    if (error) {
      console.error('Error executing query:', error.stack);
      return;
    }
    console.log('Test query result:', results[0].solution);
    
    // Close connection
    connection.end();
  });
});