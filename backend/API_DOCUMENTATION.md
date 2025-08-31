# Istiker Backend API Documentation

## Base URL

```
http://localhost:3000
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Endpoints

### 1. User Signup

**POST** `/api/auth/signup`

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "password": "password123",
  "role": "user" // optional, defaults to "user"
}
```

**Response:**

```json
{
  "success": true,
  "message": "OTP sent to your email for verification"
}
```

### 2. User Login (Request OTP)

**POST** `/api/auth/login`

**Request Body:**

```json
{
  "email": "john@example.com"
}
```

**Response:**

```json
{
  "success": true,
  "message": "OTP sent to your email"
}
```

### 3. Verify OTP

**POST** `/api/auth/verify-otp`

**Request Body:**

```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response:**

```json
{
  "success": true,
  "message": "OTP verified successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

## 🏷️ Sticker Endpoints

### 4. Get All Stickers (Public)

**GET** `/api/stickers`

**Response:**

```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "sticker_id",
      "title": "Cool Sticker",
      "description": "A cool sticker",
      "price": 10.99,
      "imageUrl": "https://cloudinary.com/image.jpg",
      "publicId": "cloudinary_public_id",
      "uploadedBy": "user_id",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 5. Add New Sticker (Admin Only)

**POST** `/api/stickers/create`

**Request Body (FormData):**

```
title: "New Sticker"
description: "A new sticker"
price: 15.99
stickerImage: [file upload]
```

**Response:**

```json
{
  "success": true,
  "message": "Sticker added",
  "data": {
    "_id": "sticker_id",
    "title": "New Sticker",
    "description": "A new sticker",
    "price": 15.99,
    "imageUrl": "https://cloudinary.com/image.jpg",
    "publicId": "cloudinary_public_id",
    "uploadedBy": "user_id",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 6. Update Sticker (Admin Only)

**PUT** `/api/stickers/:id`

**Request Body (FormData):**

```
title: "Updated Sticker" // optional
description: "Updated description" // optional
price: 20.99 // optional
image: [file upload] // optional
```

**Response:**

```json
{
  "success": true,
  "message": "Sticker updated",
  "data": {
    "_id": "sticker_id",
    "title": "Updated Sticker",
    "description": "Updated description",
    "price": 20.99,
    "imageUrl": "https://cloudinary.com/new-image.jpg",
    "publicId": "cloudinary_public_id",
    "uploadedBy": "user_id",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 7. Delete Sticker (Admin Only)

**DELETE** `/api/stickers/:id`

**Response:**

```json
{
  "success": true,
  "message": "Sticker deleted successfully"
}
```

---

## 🛒 Cart Endpoints

### 8. Add Item to Cart

**POST** `/api/cart/add`

**Request Body:**

```json
{
  "stickerId": "sticker_id",
  "quantity": 2
}
```

**Response:**

```json
{
  "success": true,
  "cart": {
    "_id": "cart_id",
    "user": "user_id",
    "items": [
      {
        "sticker": "sticker_id",
        "quantity": 2
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 9. Remove Item from Cart

**POST** `/api/cart/remove`

**Request Body:**

```json
{
  "stickerId": "sticker_id"
}
```

**Response:**

```json
{
  "success": true,
  "cart": {
    "_id": "cart_id",
    "user": "user_id",
    "items": [],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 10. Update Cart Quantity

**POST** `/api/cart/update`

**Request Body:**

```json
{
  "stickerId": "sticker_id",
  "quantity": 3
}
```

**Response:**

```json
{
  "success": true,
  "cart": {
    "_id": "cart_id",
    "user": "user_id",
    "items": [
      {
        "sticker": "sticker_id",
        "quantity": 3
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 11. Get User's Cart

**GET** `/api/cart`

**Response:**

```json
{
  "success": true,
  "cart": {
    "_id": "cart_id",
    "user": "user_id",
    "items": [
      {
        "sticker": {
          "_id": "sticker_id",
          "title": "Cool Sticker",
          "description": "A cool sticker",
          "price": 10.99,
          "imageUrl": "https://cloudinary.com/image.jpg"
        },
        "quantity": 2
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 📦 Order Endpoints

### 12. Place Order

**POST** `/api/orders`

**Request Body:**

```json
{
  "address": "123 Main St, City, State 12345",
  "items": [
    {
      "sticker": "sticker_id",
      "quantity": 2
    }
  ],
  "paymentMethod": "COD" // optional, defaults to "COD"
}
```

**Response:**

```json
{
  "success": true,
  "order": {
    "_id": "order_id",
    "user": "user_id",
    "items": [
      {
        "sticker": "sticker_id",
        "quantity": 2
      }
    ],
    "total": 21.98,
    "address": "123 Main St, City, State 12345",
    "paymentMethod": "COD",
    "status": "pending",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 13. Get User's Orders

**GET** `/api/orders/orders/me`

**Response:**

```json
{
  "success": true,
  "orders": [
    {
      "_id": "order_id",
      "user": "user_id",
      "items": [
        {
          "sticker": {
            "_id": "sticker_id",
            "title": "Cool Sticker",
            "description": "A cool sticker",
            "price": 10.99,
            "imageUrl": "https://cloudinary.com/image.jpg"
          },
          "quantity": 2
        }
      ],
      "total": 21.98,
      "address": "123 Main St, City, State 12345",
      "paymentMethod": "COD",
      "status": "pending",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 14. Get All Orders (Admin Only)

**GET** `/api/orders`

**Response:**

```json
{
  "success": true,
  "orders": [
    {
      "_id": "order_id",
      "user": {
        "_id": "user_id",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "items": [
        {
          "sticker": {
            "_id": "sticker_id",
            "title": "Cool Sticker",
            "description": "A cool sticker",
            "price": 10.99,
            "imageUrl": "https://cloudinary.com/image.jpg"
          },
          "quantity": 2
        }
      ],
      "total": 21.98,
      "address": "123 Main St, City, State 12345",
      "paymentMethod": "COD",
      "status": "pending",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 15. Update Order Status (Admin Only)

**PUT** `/api/orders/:id/status`

**Request Body:**

```json
{
  "status": "confirmed" // "pending", "confirmed", "shipped", "delivered"
}
```

**Response:**

```json
{
  "success": true,
  "order": {
    "_id": "order_id",
    "user": "user_id",
    "items": [
      {
        "sticker": "sticker_id",
        "quantity": 2
      }
    ],
    "total": 21.98,
    "address": "123 Main St, City, State 12345",
    "paymentMethod": "COD",
    "status": "confirmed",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 🔧 Health Check

### 16. Ping Server

**GET** `/api/ping`

**Response:**

```
pong
```

---

## 📝 Error Responses

All endpoints may return these error responses:

### 400 Bad Request

```json
{
  "success": false,
  "message": "Validation error message"
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

### 404 Not Found

```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## 🚀 Postman Collection Setup

1. **Environment Variables:**

   - `baseUrl`: `http://localhost:3000`
   - `token`: (will be set after login)

2. **Pre-request Script for Authentication:**

   ```javascript
   if (pm.environment.get("token")) {
     pm.request.headers.add({
       key: "Authorization",
       value: "Bearer " + pm.environment.get("token"),
     });
   }
   ```

3. **Test Script for Login:**
   ```javascript
   if (pm.response.code === 200) {
     const response = pm.response.json();
     if (response.token) {
       pm.environment.set("token", response.token);
     }
   }
   ```

---

## 📋 Testing Checklist

### Authentication Flow:

- [ ] Signup with valid data
- [ ] Login with email
- [ ] Verify OTP
- [ ] Test with invalid OTP
- [ ] Test with expired OTP

### Sticker Management:

- [ ] Get all stickers (public)
- [ ] Add sticker (admin only)
- [ ] Update sticker (admin only)
- [ ] Delete sticker (admin only)
- [ ] Test file upload

### Cart Operations:

- [ ] Add item to cart
- [ ] Remove item from cart
- [ ] Update cart quantity
- [ ] Get user's cart

### Order Management:

- [ ] Place order
- [ ] Get user's orders
- [ ] Get all orders (admin)
- [ ] Update order status (admin)

### Error Handling:

- [ ] Test with invalid token
- [ ] Test with missing required fields
- [ ] Test with invalid data types
- [ ] Test admin-only endpoints with user role
