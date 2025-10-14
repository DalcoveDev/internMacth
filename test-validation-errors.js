// Test validation errors in signup
import axios from 'axios';

async function testValidationErrors() {
  console.log('🔍 Testing validation errors...');
  
  // Test cases with different validation errors
  const testCases = [
    {
      name: 'Short name',
      data: {
        name: 'A',
        email: 'test@example.com',
        password: 'password123',
        role: 'student'
      }
    },
    {
      name: 'Invalid email',
      data: {
        name: 'Test User',
        email: 'invalid-email',
        password: 'password123',
        role: 'student'
      }
    },
    {
      name: 'Short password',
      data: {
        name: 'Test User',
        email: 'test@example.com',
        password: '123',
        role: 'student'
      }
    },
    {
      name: 'Invalid role',
      data: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'invalid'
      }
    },
    {
      name: 'Missing fields',
      data: {
        name: 'Test User',
        email: 'test@example.com'
      }
    }
  ];
  
  for (const testCase of testCases) {
    try {
      console.log(`\n--- Testing: ${testCase.name} ---`);
      console.log('Sending data:', testCase.data);
      
      const response = await axios.post('http://localhost:5001/api/auth/register', testCase.data);
      console.log('❌ Unexpected success:', response.data);
    } catch (error) {
      if (error.response) {
        console.log('✅ Expected validation error:');
        console.log('Status:', error.response.status);
        console.log('Error data:', error.response.data);
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }
  }
}

testValidationErrors();