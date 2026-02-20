# Google Maps API Setup Guide

## 🔑 Get Google Maps API Key

### Step 1: Create Google Cloud Project
1. Go to: https://console.cloud.google.com/
2. Click on project dropdown → "New Project"
3. Project name: `rent-my-trip`
4. Click "Create"

### Step 2: Enable APIs
1. In your project, go to "APIs & Services" → "Library"
2. Search and enable these APIs:
   - **Maps JavaScript API**
   - **Places API**
   - **Directions API**
   - **Geocoding API**
3. Click "Enable" for each API

### Step 3: Create API Key
1. Go to "APIs & Services" → "Credentials"
2. Click "+ Create Credentials" → "API Key"
3. Name: `Rent My Trip API Key`
4. Restrict key (recommended):
   - HTTP referrers: `http://localhost:3000/*`
   - IP addresses: (leave empty for development)
5. Click "Create"

### Step 4: Update Your Code

Replace `YOUR_API_KEY` in `TripPlanner.js` with your actual API key:

```javascript
// Line 7 in TripPlanner.js
script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_ACTUAL_API_KEY&libraries=places`;
```

## 🚨 Security Notes

### For Development:
- Use HTTP referrers restriction: `http://localhost:3000/*`
- Keep API key server-side in production

### For Production:
- Restrict by HTTP referrers to your domain
- Consider using server-side API calls
- Never expose API key in client-side code in production

## 🔧 Alternative: Use Environment Variables

1. Create `.env.local` file in root directory:
```
REACT_APP_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

2. Update TripPlanner.js:
```javascript
const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
```

## 📊 API Quotas and Pricing

### Free Tier (per month):
- Maps JavaScript API: 28,000 map loads
- Places API: 1,000 requests
- Directions API: 1,000 requests

### Recommended for Production:
- Monitor usage in Google Cloud Console
- Set up budget alerts
- Consider premium plan for high traffic

## 🧪 Testing Without API Key

The TripPlanner component includes a fallback mode that works without Google Maps:

1. Manual address input works
2. Route calculation shows mock data
3. Map shows placeholder
4. All form functionality works

## 🚀 Quick Setup

1. Get API key from: https://console.cloud.google.com/
2. Replace `YOUR_API_KEY` in `src/components/TripPlanner.js` line 7
3. Restart your React app
4. Test with real addresses

## 📱 Mobile Considerations

- Google Maps works on mobile
- Consider geolocation API for current location
- Test on different screen sizes
- Optimize for touch interactions

## 🔍 Troubleshooting

### "API Not Enabled" Error:
- Enable all required APIs in Google Cloud Console
- Wait 5-10 minutes for changes to propagate

### "Invalid API Key" Error:
- Check for typos in API key
- Verify API key restrictions
- Ensure billing account is set up

### "Referrer Not Allowed" Error:
- Add your domain to HTTP referrers
- For local: use `http://localhost:3000/*`

### Map Not Loading:
- Check browser console for errors
- Verify API key is correctly set
- Ensure internet connection is stable
