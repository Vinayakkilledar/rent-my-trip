const axios = require('axios');

async function testConnection() {
  try {
    console.log('🔗 Testing backend connection...');
    
    // Test status endpoint
    const statusResponse = await axios.get('http://localhost:5000/api/status');
    console.log('✅ Status endpoint working:', statusResponse.data);
    
    // Test registration
    console.log('\n📝 Testing user registration...');
    const registerResponse = await axios.post('http://localhost:5000/api/register', {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      phone: '1234567890',
      userType: 'customer'
    });
    console.log('✅ Registration working:', registerResponse.data);
    
    // Test login
    console.log('\n🔑 Testing user login...');
    const loginResponse = await axios.post('http://localhost:5000/api/login', {
      email: 'test@example.com',
      password: 'password123',
      userType: 'customer'
    });
    console.log('✅ Login working:', loginResponse.data);
    
    // Test get users
    console.log('\n👥 Testing get users...');
    const usersResponse = await axios.get('http://localhost:5000/api/users');
    console.log('✅ Get users working:', usersResponse.data);
    
    console.log('\n🎉 All tests passed! Your frontend is now connected to the backend.');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

testConnection();
