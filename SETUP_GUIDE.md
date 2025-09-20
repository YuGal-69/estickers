# 🚀 Setup Guide - Fix Connection Issues

## Issues Identified

1. **Backend Server Not Running**: `ERR_CONNECTION_REFUSED` error
2. **Google OAuth Not Configured**: Missing `client_id` parameter
3. **Missing Dependencies**: `google-auth-library` package

## 🔧 Quick Fix Steps

### Step 1: Start Backend Server

```bash
# Navigate to backend directory
cd backend

# Install missing dependencies
npm install

# Create .env file (copy from env.example)
cp env.example .env

# Edit .env file with your configuration
# At minimum, set:
# PORT=3000
# MONGO_URL=mongodb://localhost:27017/istiker
# JWT_SECRET=your-secret-key-here

# Start the server
npm run dev
# OR
node server.js
```

### Step 2: Configure Environment Variables

Create `backend/.env` file with:

```bash
# Required
PORT=3000
MONGO_URL=mongodb://localhost:27017/istiker
JWT_SECRET=your-super-secret-jwt-key-12345

# Optional (for email service)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Optional (for Google OAuth)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Required (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Step 3: Configure Frontend

Create `frontend/.env` file with:

```bash
# Required
VITE_API_URL=http://localhost:3000

# Optional (for Google OAuth)
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Step 4: Start Frontend

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the frontend
npm run dev
```

## 🗄️ Database Setup

### Option 1: Local MongoDB

```bash
# Install MongoDB locally
# Start MongoDB service
# Use: MONGO_URL=mongodb://localhost:27017/istiker
```

### Option 2: MongoDB Atlas (Recommended)

1. Go to https://cloud.mongodb.com/
2. Create a free cluster
3. Get connection string
4. Use: `MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/istiker`

## 🔐 Google OAuth Setup (Optional)

### If you want Google Login:

1. Go to https://console.cloud.google.com/
2. Create OAuth 2.0 credentials
3. Add to environment variables
4. Update authorized origins

### If you don't want Google Login:

- Leave Google OAuth fields empty
- Google login button will show error (this is expected)
- Use Password or OTP login instead

## 🧪 Test the Setup

### Test Backend

```bash
# Test if backend is running
curl http://localhost:3000/api/ping
# Should return: "pong"
```

### Test Frontend

1. Open http://localhost:5173
2. Try to login with password method
3. Check browser console for errors

## 🐛 Troubleshooting

### Backend Issues

- **Port 3000 in use**: Change PORT in .env file
- **MongoDB connection failed**: Check MONGO_URL
- **JWT errors**: Set JWT_SECRET in .env

### Frontend Issues

- **API connection failed**: Check VITE_API_URL
- **Google OAuth errors**: Configure Google credentials or ignore
- **Build errors**: Run `npm install` in frontend directory

### Common Solutions

1. **Restart both servers** after changing .env files
2. **Check console logs** for specific error messages
3. **Verify environment variables** are loaded correctly
4. **Test API endpoints** directly with curl/Postman

## 🎯 Quick Start Commands

```bash
# Terminal 1 - Backend
cd backend
npm install
cp env.example .env
# Edit .env file
npm run dev

# Terminal 2 - Frontend
cd frontend
npm install
cp env.example .env
# Edit .env file
npm run dev
```

## 📱 Expected Results

- Backend running on http://localhost:3000
- Frontend running on http://localhost:5173
- API calls working without connection errors
- Login page loads without Google OAuth errors
- Password and OTP login methods working

## 🆘 Still Having Issues?

1. Check if ports 3000 and 5173 are available
2. Verify MongoDB is running (if using local)
3. Check firewall/antivirus blocking connections
4. Try different ports if needed
5. Check console logs for specific error messages
