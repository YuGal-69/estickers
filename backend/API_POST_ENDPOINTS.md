# Istiker Backend - All POST Endpoints

## Base URL: `http://localhost:3000`

---

## 🔐 Authentication POST Endpoints

### 1. User Signup

**POST** `/api/auth/signup`

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "password": "password123",
  "role": "user"
}
```

### 2. User Login (Request OTP)

**POST** `/api/auth/login`

```json
{
  "email": "john@example.com"
}
```

### 3. Verify OTP

**POST** `/api/auth/verify-otp`

```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

---

## 🏷️ Sticker POST Endpoints

### 4. Add New Sticker (Admin Only)

**POST** `/api/stickers/create`
**Content-Type:** `multipart/form-data`

```
title: "New Sticker"
description: "A new sticker"
price: 15.99
stickerImage: [file upload]
```

---

## 🛒 Cart POST Endpoints

### 5. Add Item to Cart

**POST** `/api/cart/add`

```json
{
  "stickerId": "sticker_id",
  "quantity": 2
}
```

### 6. Remove Item from Cart

**POST** `/api/cart/remove`

```json
{
  "stickerId": "sticker_id"
}
```

### 7. Update Cart Quantity

**POST** `/api/cart/update`

```json
{
  "stickerId": "sticker_id",
  "quantity": 3
}
```

---

## 📦 Order POST Endpoints

### 8. Place Order

**POST** `/api/orders`

```json
{
  "address": "123 Main St, City, State 12345",
  "items": [
    {
      "sticker": "sticker_id",
      "quantity": 2
    }
  ],
  "paymentMethod": "COD"
}
```

---

## 🔧 Authentication Header

For protected endpoints, add:

```
Authorization: Bearer <your_jwt_token>
```

## 📋 Testing Flow

1. Signup → Get OTP
2. Verify OTP → Get Token
3. Use Token for all other POST requests
