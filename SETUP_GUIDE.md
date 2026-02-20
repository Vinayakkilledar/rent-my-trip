# Rent My Trip - Complete Setup Guide

Welcome to **Rent My Trip**! A modern vehicle rental platform built with React and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation Steps

#### 1. **Setup Backend Server**

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# The server uses nodemon for development. Make sure .env file is configured:
# MONGODB_URI=mongodb://localhost:27017/rent-my-trip
# JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
# PORT=5000

# Start the server
npm run dev
# or for production
npm start
```

The server will run on `http://localhost:5000`

#### 2. **Setup Frontend**

```bash
# In the project root directory
npm install

# Start the development server
npm start
```

The app will open at `http://localhost:3000`

## 🏗️ Project Structure

```
rent-my-trip/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── WelcomePage.js       # Landing page with video
│   │   ├── RegistrationPage.js  # Registration for customers & drivers
│   │   └── LoginPage.js         # User login
│   ├── utils/
│   │   └── validation.js         # Form validation utilities
│   ├── App.js                   # Main routing
│   ├── index.js                 # React entry point
│   └── index.css                # Global styles
├── server/
│   ├── server.js               # Express server & MongoDB setup
│   ├── package.json            # Server dependencies
│   └── .env                    # Environment variables
└── package.json                # Frontend dependencies
```

## ✨ Features

### Welcome Page
- **Attractive Video Background**: Showcases the rental service
- **Quick Access Buttons**: 
  - "Start My Journey" button for new users
  - "Login" button for existing users
- **Feature Highlights**: Display key benefits with icons

### Registration Page
- **Dual Registration**: Customer and Driver modes
- **Form Validation**: Real-time validation with error messages
- **Customer Fields**: Name, Email, Password, Phone
- **Driver Fields**: License Number, Vehicle Type (in addition to customer fields)
- **Password Confirmation**: Ensures password match
- **Error Handling**: Clear error messages for validation failures

### Login Page
- **User Type Selection**: Switch between Customer and Driver
- **Secure Authentication**: JWT token-based authentication
- **Form Validation**: Email and password validation
- **User Feedback**: Success and error messages

### Backend API
- **MongoDB Integration**: Stores all user data securely
- **Password Hashing**: bcryptjs for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **Data Validation**: Server-side validation for all inputs

## 🔐 API Endpoints

### Register
```
POST /api/register
Body: {
  name: string,
  email: string,
  password: string,
  phone: string,
  userType: 'customer' | 'driver',
  licenseNumber?: string,
  vehicleType?: string
}
```

### Login
```
POST /api/login
Body: {
  email: string,
  password: string,
  userType: 'customer' | 'driver'
}
Response: {
  success: boolean,
  token: string,
  user: { id, name, email, userType }
}
```

### Get All Users
```
GET /api/users
Response: {
  success: boolean,
  users: Array
}
```

## 🛠️ Technologies Used

### Frontend
- **React 18** - UI library
- **React Router DOM v6** - Client-side routing
- **Axios** - HTTP client for API calls
- **CSS3** - Modern styling with gradients and animations

### Backend
- **Node.js & Express** - Server framework
- **MongoDB & Mongoose** - Database and ODM
- **bcryptjs** - Password hashing
- **JWT (jsonwebtoken)** - Authentication
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

## 📝 Form Validation Rules

### Registration
- **Name**: Minimum 2 characters
- **Email**: Valid email format (user@example.com)
- **Password**: Minimum 6 characters with letters and numbers
- **Phone**: 10 digits
- **License Number** (Driver only): Minimum 5 characters
- **Vehicle Type** (Driver only): Required selection

### Login
- **Email**: Valid email format
- **Password**: Minimum 6 characters

## 🌐 Environment Variables

Create a `.env` file in the server folder:

```env
MONGODB_URI=mongodb://localhost:27017/rent-my-trip
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
```

## 🧪 Testing the Application

1. **Start MongoDB**: Ensure MongoDB is running on your system
2. **Start Server**: Run `npm run dev` in the server folder
3. **Start Frontend**: Run `npm start` in the root folder
4. **Test Registration**: 
   - Go to welcome page
   - Click "Start My Journey"
   - Register as Customer or Driver
5. **Test Login**:
   - Click "Login" on welcome page
   - Use credentials from registration
   - Select appropriate user type

## 📤 Data Storage

All user data is stored in MongoDB with the following structure:

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  userType: 'customer' | 'driver',
  licenseNumber: String (drivers only),
  vehicleType: String (drivers only),
  createdAt: Date
}
```

## 🔄 Authentication Flow

1. User registers with email and password
2. Password is hashed using bcryptjs (10 salt rounds)
3. User data saved to MongoDB
4. On login, password is verified against hash
5. JWT token generated and returned
6. Token stored in localStorage for future requests

## 🚀 Deployment (Coming Soon)

Instructions for deploying to:
- Frontend: Vercel / Netlify
- Backend: Heroku / Railway
- Database: MongoDB Atlas

## ❓ Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB service is running
- Check MONGODB_URI in .env file
- Use MongoDB Compass to verify connection

### CORS Errors
- Backend server must be running on port 5000
- Frontend makes requests to http://localhost:5000
- CORS is enabled in server.js

### Port Already in Use
- Change PORT in server/.env
- Update API URL in axios calls if needed

## 📧 Support

For issues or questions, please check:
- Browser console for detailed errors
- Server logs for API errors
- MongoDB logs for database issues

## 📄 License

Rent My Trip © 2024. All rights reserved.

---

**Happy Renting! 🎉**
