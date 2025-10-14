// Test login functionality
fetch('http://localhost:5001/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'ingabiredalcove@gmail.com',
    password: 'password123', // We don't know the correct password
    role: 'admin'
  })
})
.then(response => response.json())
.then(data => {
  console.log('Success:', data);
})
.catch(error => {
  console.error('Error:', error);
});