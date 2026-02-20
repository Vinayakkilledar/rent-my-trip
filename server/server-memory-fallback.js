const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory database for testing (fallback when MongoDB is not available)
let users = [];
let nextUserId = 1;

console.log('🔧 Using in-memory database for testing');
console.log('⚠️  This is a temporary solution - install MongoDB for production');

// Helper functions
const findUser = (email, userType) => {
  return users.find(user => user.email === email && user.userType === userType);
};

const findUserByEmail = (email) => {
  return users.find(user => user.email === email);
};

const saveUser = async (userData) => {
  const newUser = {
    _id: nextUserId++,
    ...userData,
    createdAt: new Date()
  };
  users.push(newUser);
  return newUser;
};

app.post('/api/register', async (req, res) => {
  try {
    console.log('📝 Registration request received (memory fallback):', {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      userType: req.body.userType
    });

    const { name, email, password, phone, userType, licenseNumber, driveType, carName, carModel, numberOfSeats, carType } = req.body;

    // Validation
    if (!name || !email || !password || !phone || !userType) {
      return res.status(400).json({ 
        success: false, 
        message: 'All required fields must be provided' 
      });
    }

    const existingUser = findUserByEmail(email);
    if (existingUser) {
      console.log('⚠️ User already exists:', email);
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('🔐 Password hashed successfully');

    const newUser = await saveUser({
      name,
      email,
      password: hashedPassword,
      phone,
      userType,
      licenseNumber: userType === 'driver' ? licenseNumber : undefined,
      driveType: userType === 'driver' ? driveType : undefined,
      carName: userType === 'driver' ? carName : undefined,
      carModel: userType === 'driver' ? carModel : undefined,
      numberOfSeats: userType === 'driver' ? numberOfSeats : undefined,
      carType: userType === 'driver' ? carType : undefined
    });

    console.log('✅ User registered successfully (memory fallback):', { name, email, userType });

    res.status(201).json({ success: true, message: 'User registered successfully (stored in memory)' });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    console.log('🔑 Login request received (memory fallback):', {
      email: req.body.email,
      userType: req.body.userType
    });

    const { email, password, userType } = req.body;

    // Validation
    if (!email || !password || !userType) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email, password, and user type are required' 
      });
    }

    const user = findUser(email, userType);
    if (!user) {
      console.log('⚠️ User not found:', { email, userType });
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('⚠️ Password mismatch for:', email);
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, userType: user.userType },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '24h' }
    );

    console.log('✅ Login successful (memory fallback):', { name: user.name, email, userType });

    res.json({ 
      success: true, 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        userType: user.userType 
      } 
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    // Return users without passwords
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);
    res.json({ success: true, users: usersWithoutPasswords });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/status', async (req, res) => {
  try {
    res.json({
      success: true,
      database: {
        state: 'memory-fallback',
        connected: true,
        name: 'in-memory',
        note: 'Using in-memory storage - install MongoDB for persistence'
      },
      users: {
        total: users.length,
        customers: users.filter(u => u.userType === 'customer').length,
        drivers: users.filter(u => u.userType === 'driver').length
      },
      server: {
        status: 'running',
        port: PORT,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('❌ Status check error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT} (memory fallback mode)`);
  console.log(`📊 API Endpoints:`);
  console.log(`   POST /api/register - User registration`);
  console.log(`   POST /api/login - User login`);
  console.log(`   GET  /api/users - Get all users`);
  console.log(`   GET  /api/status - Database status`);
  console.log(`🔗 Frontend should connect to: http://localhost:${PORT}`);
  console.log(`⚠️  Install MongoDB for data persistence!`);
});
