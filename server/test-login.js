const axios = require('axios');

async function testLogin() {
  try {
    console.log('🔍 Testing login endpoint...');
    
    // Test with existing user
    const response = await axios.post('http://localhost:5001/api/auth/login', {
      email: 'ingabiredalcove@gmail.com',
      password: 'testpassword', // This might be wrong
      role: 'admin'
    });
    
    console.log('✅ Login successful!');
    console.log('Response:', response.data);
  } catch (error) {
    if (error.response) {
      console.log('❌ Login failed with status:', error.response.status);
      console.log('Error message:', error.response.data);
    } else {
      console.log('❌ Login failed with error:', error.message);
    }
  }
}

testLogin();