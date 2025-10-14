// Test signup with detailed error reporting
import axios from 'axios';

async function testSignup() {
  try {
    console.log('🔍 Testing signup endpoint...');
    
    // Test data with unique email
    const testData = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123',
      role: 'student'
    };
    
    console.log('Sending data:', testData);
    
    const response = await axios.post('http://localhost:5001/api/auth/register', testData);
    
    console.log('✅ Signup successful!');
    console.log('Response:', response.data);
  } catch (error) {
    if (error.response) {
      console.log('❌ Signup failed with status:', error.response.status);
      console.log('Error data:', error.response.data);
    } else {
      console.log('❌ Signup failed with error:', error.message);
    }
  }
}

testSignup();