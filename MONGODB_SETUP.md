# MongoDB Setup Guide for Rent My Trip

## 🚨 MongoDB Not Detected

MongoDB is not installed on your system. Follow these steps to set it up:

## Option 1: Install MongoDB locally

### Windows Installation:
1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Choose Windows version and download the MSI installer
3. Run the installer with "Complete" setup
4. Install MongoDB Compass (GUI tool)
5. During installation, choose "Install MongoDB as a Service"

### Start MongoDB Service:
```bash
# Start MongoDB service
net start MongoDB

# Stop MongoDB service
net stop MongoDB
```

### Verify Installation:
```bash
# Check MongoDB version
mongod --version

# Connect to MongoDB
mongo
```

## Option 2: Use MongoDB Atlas (Cloud Database)

1. Go to: https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster (free tier)
4. Get your connection string
5. Update your `.env` file with the connection string

### Example .env file:
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/rent-my-trip?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
```

## Option 3: Use Docker (Recommended for Development)

1. Install Docker Desktop from: https://www.docker.com/products/docker-desktop
2. Run MongoDB container:

```bash
# Pull MongoDB image
docker pull mongo

# Run MongoDB container
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Stop container
docker stop mongodb

# Start container
docker start mongodb
```

## Current Status

✅ Backend server is configured for MongoDB
✅ API endpoints are ready
✅ Frontend is connected to backend
❌ MongoDB database is not running

## Testing Without MongoDB

For testing purposes, your application will show connection errors but the frontend will still work. Once MongoDB is set up, all registration and login data will be stored in the database.

## Next Steps

1. Choose one of the MongoDB setup options above
2. Start MongoDB
3. Restart your backend server
4. Test registration and login functionality

## Verification

After setting up MongoDB, visit: http://localhost:5000/api/status

You should see a response like:
```json
{
  "success": true,
  "database": {
    "state": "connected",
    "connected": true,
    "name": "rent-my-trip"
  },
  "users": {
    "total": 0,
    "customers": 0,
    "drivers": 0
  }
}
```

## Troubleshooting

- **Port 27017 in use**: Change MongoDB port or stop conflicting service
- **Connection refused**: Make sure MongoDB service is running
- **Authentication error**: Check your MongoDB credentials in .env file

## Support

For MongoDB installation help:
- Official docs: https://docs.mongodb.com/manual/installation/
- Community forums: https://community.mongodb.com/
