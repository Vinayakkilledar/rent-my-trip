const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rent-my-trip', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    console.log('📊 Database: rent-my-trip');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    console.log('🔧 Make sure MongoDB is running on localhost:27017');
  });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  userType: { type: String, enum: ['customer', 'driver'], required: true },
  licenseNumber: { type: String },
  driveType: { type: String },
  carName: { type: String },
  carModel: { type: String },
  numberOfSeats: { type: String },
  carType: { type: String },
  location: { type: String },
  carPhoto: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Lodge booking schema
const lodgeBookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  placeId: { type: String, required: true },
  lodgeName: { type: String, required: true },
  address: { type: String, default: '' },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  checkIn: { type: String, required: true },
  checkOut: { type: String, required: true },
  roomNumber: { type: String, required: true },
  bookingId: { type: String, required: true, unique: true },
  advanceAmount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const LodgeBooking = mongoose.model('LodgeBooking', lodgeBookingSchema);

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper: ensure MongoDB is connected before handling write/read
const requireDb = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database not connected. Please start MongoDB (see MONGODB_SETUP.md) and ensure the backend is running.'
    });
  }
  next();
};

app.post('/api/register', requireDb, async (req, res) => {
  try {
    console.log('📝 Registration request received:', {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      userType: req.body.userType
    });

    const { name, email, password, phone, userType, licenseNumber, driveType, carName, carModel, numberOfSeats, carType, location, carPhoto } = req.body;

    // Validation
    if (!name || !email || !password || !phone || !userType) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('⚠️ User already exists:', email);
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('🔐 Password hashed successfully');

    const newUser = new User({
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
      carType: userType === 'driver' ? carType : undefined,
      location: userType === 'driver' ? location : undefined,
      carPhoto: userType === 'driver' ? carPhoto : undefined
    });

    await newUser.save();
    console.log('✅ User registered successfully:', { name, email, userType });

    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error('❌ Registration error:', error);

    // Handle MongoDB duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        success: false,
        message: `An account with that ${field} already exists.`
      });
    }

    // Handle MongoDB validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during registration. Please check database connection.'
    });
  }
});

app.post('/api/login', requireDb, async (req, res) => {
  try {
    console.log('🔑 Login request received:', {
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

    const user = await User.findOne({ email, userType });
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
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('✅ Login successful:', { name: user.name, email, userType });

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

app.get('/api/users', requireDb, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/lodge-bookings', requireDb, async (req, res) => {
  try {
    const { placeId, lodgeName, address, lat, lng, checkIn, checkOut, roomNumber, bookingId, advanceAmount, paymentMethod } = req.body;

    if (!placeId || !lodgeName || !lat || !lng || !checkIn || !checkOut || !roomNumber || !bookingId || !advanceAmount || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Missing required booking fields'
      });
    }

    const booking = new LodgeBooking({
      placeId,
      lodgeName,
      address: address || '',
      lat,
      lng,
      checkIn,
      checkOut,
      roomNumber,
      bookingId,
      advanceAmount,
      paymentMethod,
      userId: req.body.userId || null
    });

    await booking.save();
    console.log('✅ Lodge booking saved:', bookingId);

    res.status(201).json({
      success: true,
      message: 'Lodge booking confirmed',
      booking: {
        _id: booking._id,
        placeId: booking.placeId,
        lodgeName: booking.lodgeName,
        address: booking.address,
        lat: booking.lat,
        lng: booking.lng,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        roomNumber: booking.roomNumber,
        bookingId: booking.bookingId,
        advanceAmount: booking.advanceAmount,
        paymentMethod: booking.paymentMethod
      }
    });
  } catch (error) {
    console.error('❌ Lodge booking error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Booking ID already exists' });
    }
    res.status(500).json({ success: false, message: 'Server error during lodge booking' });
  }
});

app.get('/api/lodge-bookings', requireDb, async (req, res) => {
  try {
    const filter = req.query.userId ? { userId: req.query.userId } : {};
    const bookings = await LodgeBooking.find(filter).sort({ createdAt: -1 }).limit(200);
    res.json({ success: true, bookings });
  } catch (error) {
    console.error('Error fetching lodge bookings:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/status', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const dbStates = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };

    const userCount = await User.countDocuments();

    res.json({
      success: true,
      database: {
        state: dbStates[dbState],
        connected: dbState === 1,
        name: mongoose.connection.name
      },
      users: {
        total: userCount,
        customers: await User.countDocuments({ userType: 'customer' }),
        drivers: await User.countDocuments({ userType: 'driver' })
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
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 API Endpoints:`);
  console.log(`   POST /api/register - User registration`);
  console.log(`   POST /api/login - User login`);
  console.log(`   GET  /api/users - Get all users`);
  console.log(`   GET  /api/status - Database status`);
  console.log(`🔗 Frontend should connect to: http://localhost:${PORT}`);
});
