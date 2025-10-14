// Test internship posting with detailed error reporting
import axios from 'axios';

async function testInternshipPost() {
  try {
    console.log('🔍 Testing internship posting endpoint...');
    
    // First, we need to login to get a token
    const loginResponse = await axios.post('http://localhost:5001/api/auth/login', {
      email: 'testuser@example.com',
      password: 'password123',
      role: 'company'
    });
    
    const token = loginResponse.data.data.token;
    console.log('✅ Login successful, got token');
    
    // Test data for internship posting
    const internshipData = {
      title: 'Software Development Intern',
      description: 'Join our engineering team to develop cutting-edge web applications using React and Node.js. You will work directly with senior developers on real projects and gain valuable industry experience. This is an excellent opportunity for students interested in full-stack development.',
      requirements: 'Must be currently pursuing a degree in Computer Science or related field. Experience with JavaScript, HTML, and CSS required. Familiarity with React and Node.js preferred. Strong problem-solving skills and ability to work in a team environment.',
      responsibilities: 'Develop and maintain web applications, collaborate with design and product teams, write clean maintainable code, participate in code reviews, and document technical processes.',
      benefits: 'Flexible working hours, mentorship from senior developers, opportunity to work on real projects, potential for future employment, and professional development opportunities.',
      location: 'San Francisco, CA',
      type: 'full-time',
      duration: '3 months',
      deadline: '2023-12-31',
      start_date: '2024-01-15',
      end_date: '2024-04-15',
      salary_min: 25,
      salary_max: 30,
      salary_type: 'hourly',
      skills_required: 'React, JavaScript, Node.js, HTML, CSS',
      experience_level: 'entry'
    };
    
    console.log('Sending internship data:', internshipData);
    
    const response = await axios.post('http://localhost:5001/api/internships', internshipData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Internship posted successfully!');
    console.log('Response:', response.data);
  } catch (error) {
    if (error.response) {
      console.log('❌ Internship posting failed with status:', error.response.status);
      console.log('Error data:', error.response.data);
    } else {
      console.log('❌ Internship posting failed with error:', error.message);
    }
  }
}

testInternshipPost();