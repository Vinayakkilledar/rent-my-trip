<<<<<<< HEAD
# Rent My Trip

A vehicle rental platform built with React and MongoDB.

## Features

- **Welcome Page**: Attractive video background with call-to-action
- **User Registration**: Separate registration for customers and drivers
- **User Login**: Secure authentication for both user types
- **MongoDB Integration**: Secure data storage with bcrypt password hashing

## Project Structure

```
rent-my-trip/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── WelcomePage.js
│   │   │   ├── RegistrationPage.js
│   │   │   └── LoginPage.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── server/                 # Node.js backend
│   ├── server.js
│   ├── package.json
│   └── .env
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (installed and running)

### Frontend Setup

1. Navigate to the project directory:
```bash
cd "c:/Users/vinay/OneDrive/Desktop/rent-my-trip(project)"
```

2. Install frontend dependencies:
```bash
npm install
```

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install backend dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory with the following:
```
MONGODB_URI=mongodb://localhost:27017/rent-my-trip
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
```

## Running the Application

### Start MongoDB
Make sure MongoDB is running on your system.

### Start the Backend Server
```bash
cd server
npm start
```
The server will run on `http://localhost:5000`

### Start the Frontend
Open a new terminal and run:
```bash
cd "c:/Users/vinay/OneDrive/Desktop/rent-my-trip(project)"
npm start
```
The application will open in your browser at `http://localhost:3000`

## Usage

1. **Welcome Page**: View the attractive landing page with video background
2. **Start Journey**: Click "Start My Journey" to go to registration
3. **Registration**: Choose between Customer or Driver registration
4. **Login**: Use your credentials to login
5. **Dashboard**: After login, you'll be redirected to the appropriate dashboard

## API Endpoints

- `POST /api/register` - Register new user
- `POST /api/login` - User login
- `GET /api/users` - Get all users (admin only)

## Database Schema

### Users Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  userType: String ('customer' | 'driver'),
  licenseNumber: String (drivers only),
  vehicleType: String (drivers only),
  createdAt: Date
}
```

## Technologies Used

### Frontend
- React 18
- React Router DOM
- Axios
- CSS3 Animations

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- CORS

## Features Implemented

✅ Welcome page with video background
✅ Customer registration
✅ Driver registration with license and vehicle details
✅ Login system for both user types
✅ MongoDB integration
✅ Password security with bcrypt
✅ JWT authentication
✅ Responsive design
✅ Modern UI with gradients and animations

## Future Enhancements

- Customer dashboard for browsing vehicles
- Driver dashboard for managing listings
- Vehicle booking system
- Payment integration
- Rating and review system
- Real-time notifications
- Mobile app development
=======
# rent-my-trip
>>>>>>> f5b38a3300b5b32057842a5aabb94f04e8184eab
