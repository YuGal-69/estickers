# 🔐 Authentication Guide - Istiker

## Overview

Istiker now supports multiple authentication methods to work around Render's free tier limitations that block SMTP ports. This guide explains all available authentication options.

## 🚀 Available Authentication Methods

### 1. **OTP-based Authentication (Original)**

- **How it works**: User enters email → OTP sent to email → User enters OTP → Login
- **Status**: ✅ Works with email service, gracefully handles SMTP failures
- **Best for**: Production environments with working email service

### 2. **Password-based Authentication (New)**

- **How it works**: User enters email + password → Direct login
- **Status**: ✅ Always works, no external dependencies
- **Best for**: Render free tier, development, production fallback

### 3. **Google OAuth Authentication (New)**

- **How it works**: User clicks "Continue with Google" → Google authentication → Login
- **Status**: ✅ Ready for integration (currently uses mock data)
- **Best for**: User convenience, production environments

## 🛠️ Implementation Details

### Backend Changes

#### New API Endpoints

```javascript
// Password-based login
POST /api/auth/login-password
{
  "email": "user@example.com",
  "password": "userpassword"
}

// Google OAuth login
POST /api/auth/google-login
{
  "email": "user@gmail.com",
  "name": "User Name",
  "googleId": "google_123456789",
  "profilePicture": "https://example.com/photo.jpg"
}
```

#### Updated User Model

```javascript
{
  name: String (required),
  email: String (unique, required),
  password: String (optional for Google users),
  googleId: String (unique, sparse),
  profilePicture: String,
  role: "user" | "admin",
  phone: String (required for non-Google users),
  isVerified: Boolean,
  otp: { code: String, expiresAt: Date }
}
```

#### SMTP Failure Handling

- All OTP-related endpoints now gracefully handle SMTP failures
- When email service is unavailable, OTP is returned in the API response
- Frontend displays OTP in toast notifications for development/testing

### Frontend Changes

#### Enhanced Login Page

- **Method Selection**: Toggle between OTP and Password login
- **Google Login Button**: One-click Google authentication
- **Smart UI**: Form adapts based on selected method
- **Error Handling**: Clear feedback for all authentication methods

#### Updated AuthContext

```javascript
const {
  signup,
  login, // OTP-based
  loginWithPassword, // Password-based
  googleLogin, // Google OAuth
  verifyOtp,
  logout,
} = useAuth();
```

## 🚀 Deployment on Render

### Environment Variables

```bash
# Required
PORT=3000
MONGO_URL=mongodb://...
JWT_SECRET=your-secret-key

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

### Render Free Tier Compatibility

- ✅ **Password Authentication**: Works perfectly
- ✅ **Google OAuth**: Works with proper setup
- ⚠️ **OTP Authentication**: Gracefully handles SMTP failures
- ✅ **All other features**: Fully functional

## 📱 User Experience

### Login Flow Options

#### Option 1: Password Login (Recommended for Render)

1. User visits login page
2. Selects "Password" method
3. Enters email and password
4. Clicks "Login"
5. Redirected to dashboard

#### Option 2: OTP Login (Fallback)

1. User visits login page
2. Selects "OTP Login" method
3. Enters email
4. Clicks "Send OTP"
5. If email works: Receives OTP via email
6. If email fails: OTP shown in browser notification
7. Enters OTP and verifies
8. Redirected to dashboard

#### Option 3: Google Login (Convenience)

1. User visits login page
2. Clicks "Continue with Google"
3. Google authentication (when properly configured)
4. Redirected to dashboard

## 🔧 Development Setup

### Local Development

```bash
# Backend
cd backend
npm install
cp env.example .env
# Configure your .env file
npm run dev

# Frontend
cd frontend
npm install
cp env.example .env
# Set VITE_API_URL=http://localhost:3000
npm run dev
```

### Testing Authentication Methods

#### Test Password Login

```bash
curl -X POST http://localhost:3000/api/auth/login-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

#### Test OTP Login (with SMTP failure handling)

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

#### Test Google Login

```bash
curl -X POST http://localhost:3000/api/auth/google-login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@gmail.com","name":"Test User","googleId":"google_123","profilePicture":"https://example.com/photo.jpg"}'
```

## 🎯 Production Recommendations

### For Render Free Tier

1. **Primary**: Use Password authentication
2. **Secondary**: Implement Google OAuth for user convenience
3. **Fallback**: Keep OTP authentication for users who prefer it

### For Production with Email Service

1. **Primary**: Use OTP authentication for security
2. **Secondary**: Offer Password authentication as alternative
3. **Convenience**: Implement Google OAuth

## 🔒 Security Considerations

### Password Security

- Passwords are hashed using bcryptjs
- Minimum 6 characters required
- Stored securely in database

### JWT Tokens

- 30-day expiration
- Secure secret key required
- Role-based access control

### Google OAuth

- Verify Google ID on backend
- Store minimal user data
- Handle account linking properly

## 🐛 Troubleshooting

### Common Issues

#### "Email service unavailable" Error

- **Cause**: SMTP ports blocked on Render free tier
- **Solution**: Use password authentication or check OTP in response

#### "Invalid password" Error

- **Cause**: User hasn't set up password authentication
- **Solution**: User needs to sign up first or use OTP method

#### Google Login Not Working

- **Cause**: Google OAuth not properly configured
- **Solution**: Set up Google OAuth credentials and update frontend

### Debug Mode

- Check browser console for detailed error messages
- Backend logs show authentication attempts
- OTP responses include development OTP when email fails

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint                   | Description        | Auth Required |
| ------ | -------------------------- | ------------------ | ------------- |
| POST   | `/api/auth/signup`         | Register new user  | No            |
| POST   | `/api/auth/login`          | Request OTP        | No            |
| POST   | `/api/auth/login-password` | Password login     | No            |
| POST   | `/api/auth/google-login`   | Google OAuth login | No            |
| POST   | `/api/auth/verify-otp`     | Verify OTP         | No            |
| POST   | `/api/auth/resend-otp`     | Resend OTP         | No            |

### Response Format

```javascript
// Success Response
{
  "success": true,
  "message": "Login successful",
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "user"
  }
}

// Error Response
{
  "success": false,
  "message": "Error description"
}
```

## 🎉 Conclusion

The enhanced authentication system provides multiple login options that work seamlessly across different deployment environments, including Render's free tier. Users can choose their preferred authentication method, and the system gracefully handles service limitations.

For any questions or issues, refer to the troubleshooting section or check the application logs for detailed error information.
