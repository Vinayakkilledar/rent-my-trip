# Quick Start — Fix "Could not connect" & Store Data in MongoDB

If you see **"Could not connect to the server. Is the backend running on port 5000?"**, do the following.

## 1. Start MongoDB

Your app stores registered users in **MongoDB**. Start MongoDB first.

**Option A — MongoDB installed locally (Windows)**  
- Open a terminal as Administrator and run: `net start MongoDB`  
- Or start it from Services (services.msc) → MongoDB Server.

**Option B — MongoDB Atlas (cloud)**  
- Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).  
- In the `server` folder, create or edit `.env` and set:
  - `MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/rent-my-trip?retryWrites=true&w=majority`

**Option C — Docker**  
- Run: `docker run -d -p 27017:27017 --name mongodb mongo:latest`

More options: see **MONGODB_SETUP.md**.

## 2. Start the backend server

From the **project root** (where `package.json` is):

```bash
npm run backend
```

Or from the `server` folder:

```bash
cd server
npm install
npm start
```

You should see:
- `MongoDB connected successfully`
- `Server is running on port 5000`

## 3. Open the app

- **Static (Live Server):** Open `index.html` with Live Server (e.g. port 5501).  
- **React app:** In another terminal run `npm start` and use http://localhost:3000.

## 4. Register

Use the registration form. Data is saved to MongoDB (database name: `rent-my-trip`, collection: `users`).

**Check that it works:**  
- Backend: http://localhost:5000/api/status  
- You should see `"connected": true` and user counts after registering.

## 5. Trip Assistance Dashboard (optional)

After a successful **car** booking, you can open the Trip Assistance Dashboard to:
- View nearby tourist places, hotels (🏢), lodges (🏠), and petrol pumps (⛽) within 200m
- Advance-book lodges with date selection and simulated payment

**Setup:**
1. Create `.env` in the project root (copy from `.env.example`)
2. Set `REACT_APP_GOOGLE_MAPS_API_KEY=your_key`
3. Enable **Maps JavaScript API** and **Places API** in [Google Cloud Console](https://console.cloud.google.com/)
4. Run `npm install` (installs `@react-google-maps/api`)

**Access:**
- After car booking: click **Trip Assistance**
- Or open `/trip-assistance` directly
