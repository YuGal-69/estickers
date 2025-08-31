# Backend API Structure Analysis & Frontend Integration

## 📊 Backend API Overview

### Server Configuration

- **Port**: 3000 (default)
- **Base URL**: `http://localhost:3000`
- **Authentication**: JWT Bearer Token
- **File Upload**: Cloudinary integration

### API Routes Structure

```
/api/auth/*     - Authentication endpoints
/api/stickers/* - Sticker management
/api/cart/*     - Shopping cart operations
/api/orders/*   - Order management
```

---

## 🔐 Authentication System

### Flow:

1. **Signup** → Sends OTP to email
2. **Login** → Requests OTP for existing user
3. **Verify OTP** → Returns JWT token + user data

### POST Endpoints:

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - Request login OTP
- `POST /api/auth/verify-otp` - Verify OTP & get token

### Data Validation:

```javascript
// Signup validation
{
  name: string (min 2 chars),
  email: valid email,
  phone: string (10-15 chars),
  password: string (min 6 chars),
  role: "user" | "admin" (optional)
}
```

---

## 🏷️ Sticker Management

### Public Endpoints:

- `GET /api/stickers` - Get all stickers

### Admin Only Endpoints:

- `POST /api/stickers/create` - Add new sticker (with image)
- `PUT /api/stickers/:id` - Update sticker
- `DELETE /api/stickers/:id` - Delete sticker

### File Upload:

- Uses `multipart/form-data`
- Image field: `stickerImage` or `image`
- Uploads to Cloudinary

### Sticker Data Structure:

```javascript
{
  title: string (required),
  description: string (optional),
  price: number (positive, required),
  imageUrl: string (Cloudinary URL),
  publicId: string (Cloudinary ID)
}
```

---

## 🛒 Cart Operations

### All endpoints require authentication:

- `POST /api/cart/add` - Add item to cart
- `POST /api/cart/remove` - Remove item from cart
- `POST /api/cart/update` - Update quantity
- `GET /api/cart` - Get user's cart

### Cart Data Structure:

```javascript
{
  user: ObjectId,
  items: [
    {
      sticker: ObjectId,
      quantity: number
    }
  ]
}
```

---

## 📦 Order Management

### User Endpoints:

- `POST /api/orders` - Place order
- `GET /api/orders/orders/me` - Get user's orders

### Admin Endpoints:

- `GET /api/orders` - Get all orders
- `PUT /api/orders/:id/status` - Update order status

### Order Data Structure:

```javascript
{
  user: ObjectId,
  items: [
    {
      sticker: ObjectId,
      quantity: number
    }
  ],
  total: number,
  address: string,
  paymentMethod: string,
  status: "pending" | "confirmed" | "shipped" | "delivered"
}
```

---

## 🔧 Frontend Integration

### Updated API Service (`frontend/src/services/api.js`)

#### Authentication Service:

```javascript
authService = {
  signup: async (userData) => {},
  login: async (email) => {},
  verifyOtp: async (email, otp) => {},
  logout: () => {},
  getCurrentUser: () => {},
  isAuthenticated: () => {},
};
```

#### Sticker Service:

```javascript
stickerService = {
  getAllStickers: async () => {},
  addSticker: async (stickerData, imageFile) => {},
  updateSticker: async (stickerId, stickerData, imageFile) => {},
  deleteSticker: async (stickerId) => {},
};
```

#### Cart Service:

```javascript
cartService = {
  addToCart: async (stickerId, quantity) => {},
  removeFromCart: async (stickerId) => {},
  updateCartQuantity: async (stickerId, quantity) => {},
  getCart: async () => {},
};
```

#### Order Service:

```javascript
orderService = {
  placeOrder: async (orderData) => {},
  getUserOrders: async () => {},
  getAllOrders: async () => {},
  updateOrderStatus: async (orderId, status) => {},
};
```

---

## 🚀 Postman Testing Guide

### Environment Setup:

1. Create environment with variables:
   - `baseUrl`: `http://localhost:3000`
   - `token`: (empty initially)

### Authentication Flow:

1. **Signup** → Get success message
2. **Login** → Get OTP sent message
3. **Verify OTP** → Get token, save to environment
4. **Use token** for all protected endpoints

### File Upload Testing:

- Use `multipart/form-data` for sticker creation
- Include image file in form data
- Set proper field names (`stickerImage` or `image`)

### Error Handling:

- 400: Validation errors
- 401: Unauthorized (missing/invalid token)
- 404: Resource not found
- 500: Server errors

---

## 📋 Complete API Endpoint List

### POST Endpoints (8 total):

1. `POST /api/auth/signup`
2. `POST /api/auth/login`
3. `POST /api/auth/verify-otp`
4. `POST /api/stickers/create` (admin)
5. `POST /api/cart/add`
6. `POST /api/cart/remove`
7. `POST /api/cart/update`
8. `POST /api/orders`

### GET Endpoints:

- `GET /api/stickers` (public)
- `GET /api/cart`
- `GET /api/orders/orders/me`
- `GET /api/orders` (admin)

### PUT Endpoints:

- `PUT /api/stickers/:id` (admin)
- `PUT /api/orders/:id/status` (admin)

### DELETE Endpoints:

- `DELETE /api/stickers/:id` (admin)

---

## 🔄 Frontend-Backend Integration Status

### ✅ Implemented:

- Authentication flow (signup, login, OTP)
- Token management
- Error handling
- File upload support
- All service functions

### 🎯 Ready for Testing:

- All POST endpoints documented
- Frontend API service updated
- Postman collection structure defined
- Error responses standardized

### 📝 Next Steps:

1. Test all endpoints in Postman
2. Verify frontend integration
3. Test file uploads
4. Validate error handling
5. Test admin vs user permissions
