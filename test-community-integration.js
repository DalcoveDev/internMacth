const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:5001/api';
const TEST_USER = {
  email: 'student@test.com',
  password: 'password123',
  role: 'student'
};

let authToken = null;

// Test functions
async function testCommunityAPI() {
  try {
    console.log('🧪 Testing Community API Integration...\n');
    
    // 1. Login to get auth token
    console.log('1. Logging in...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, TEST_USER);
    authToken = loginResponse.data.data.token;
    console.log('✅ Login successful\n');
    
    // 2. Test get discussions
    console.log('2. Testing get discussions...');
    const discussionsResponse = await axios.get(`${BASE_URL}/community/discussions`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log(`✅ Got ${discussionsResponse.data.data.length} discussions\n`);
    
    // 3. Test get events
    console.log('3. Testing get events...');
    const eventsResponse = await axios.get(`${BASE_URL}/community/events`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log(`✅ Got ${eventsResponse.data.data.length} events\n`);
    
    // 4. Test get achievements
    console.log('4. Testing get achievements...');
    const achievementsResponse = await axios.get(`${BASE_URL}/community/achievements`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log(`✅ Got ${achievementsResponse.data.data.length} achievements\n`);
    
    // 5. Test create discussion (if user is authenticated)
    console.log('5. Testing create discussion...');
    const createDiscussionResponse = await axios.post(
      `${BASE_URL}/community/discussions`,
      {
        title: 'Test Discussion',
        content: 'This is a test discussion created by the integration test',
        tags: ['test', 'integration']
      },
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    console.log(`✅ Created discussion with ID: ${createDiscussionResponse.data.data.id}\n`);
    
    // 6. Test create event (if user is authenticated)
    console.log('6. Testing create event...');
    const createEventResponse = await axios.post(
      `${BASE_URL}/community/events`,
      {
        title: 'Test Event',
        description: 'This is a test event created by the integration test',
        date: '2023-12-31',
        time: '14:00:00',
        location: 'Test Location',
        type: 'Test'
      },
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    console.log(`✅ Created event with ID: ${createEventResponse.data.data.id}\n`);
    
    console.log('🎉 All community integration tests passed!');
    return true;
  } catch (error) {
    console.error('❌ Community integration test failed:', error.response?.data || error.message);
    return false;
  }
}

// Run the test
testCommunityAPI().then(success => {
  process.exit(success ? 0 : 1);
});