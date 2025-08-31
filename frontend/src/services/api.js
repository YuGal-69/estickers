// services/api.js
import axios from "axios";

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem("token");
};

// Set token in localStorage
const setToken = (token) => {
  localStorage.setItem("token", token);
};

// Remove token from localStorage
const removeToken = () => {
  localStorage.removeItem("token");
};

// Get user from localStorage
const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Set user in localStorage
const setUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

// Remove user from localStorage
const removeUser = () => {
  localStorage.removeItem("user");
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getToken();
};

// Get current user
export const getCurrentUser = () => {
  return getUser();
};

// Logout function
export const logout = () => {
  removeToken();
  removeUser();
  window.location.href = "/";
};

// Test backend connection
export const testBackendConnection = async () => {
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
  try {
    const response = await fetch(`${baseUrl}/api/ping`);
    return response.ok;
  } catch (error) {
    console.error("Backend connection test failed:", error);
    return false;
  }
};

// API request with authentication
const apiRequest = async (url, options = {}) => {
  const token = getToken();
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const fullUrl = baseUrl + url;

  // console.log("Making API request to:", fullUrl); // Debug log

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const res = await fetch(fullUrl, config);
    // console.log("Response status:", res.status); // Debug log

    const text = await res.text();
    let json = {};

    try {
      json = JSON.parse(text);
    } catch (err) {
      // console.log("Failed to parse JSON response:", text); // Debug log
    }

    if (!res.ok) {
      // Handle authentication errors
      if (res.status === 401) {
        logout();
        throw new Error("Session expired. Please login again.");
      }
      throw new Error(json.message || `HTTP ${res.status}: ${res.statusText}`);
    }

    return json;
  } catch (error) {
    console.error("API request failed:", error); // Debug log

    // Check if it's a connection error
    if (
      error.message.includes("Failed to fetch") ||
      error.message.includes("ERR_CONNECTION_REFUSED")
    ) {
      throw new Error(
        "Backend server is not running. Please start the backend server first."
      );
    }

    throw error;
  }
};

// File upload API request
const apiRequestWithFile = async (url, formData) => {
  const token = getToken();
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const fullUrl = baseUrl + url;

  // console.log("Making file upload request to:", fullUrl);

  const config = {
    method: "POST",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  };

  try {
    const res = await fetch(fullUrl, config);
    // console.log("File upload response status:", res.status);

    const text = await res.text();
    let json = {};

    try {
      json = JSON.parse(text);
    } catch (err) {
      // console.log("Failed to parse JSON response:", text);
    }

    if (!res.ok) {
      if (res.status === 401) {
        logout();
        throw new Error("Session expired. Please login again.");
      }
      throw new Error(json.message || `HTTP ${res.status}: ${res.statusText}`);
    }

    return json;
  } catch (error) {
    console.error("File upload failed:", error);
    throw error;
  }
};

export const apiPost = async (url, data) => {
  return await apiRequest(url, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const apiGet = async (url) => {
  return await apiRequest(url, {
    method: "GET",
  });
};

export const apiPut = async (url, data) => {
  return apiRequest(url, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const apiDelete = async (url) => {
  return apiRequest(url, {
    method: "DELETE",
  });
};

// Authentication specific functions
export const authService = {
  // Signup
  signup: async (userData) => {
    const response = await apiPost("/api/auth/signup", userData);
    return response;
  },

  // Login (request OTP)
  login: async (email) => {
    const response = await apiPost("/api/auth/login", { email });
    return response;
  },

  // Verify OTP
  verifyOtp: async (email, otp) => {
    const response = await apiPost("/api/auth/verify-otp", { email, otp });

    // If verification successful, store token and user data
    if (response.success && response.token) {
      setToken(response.token);
      setUser(response.user);
    }

    return response;
  },

  // Logout
  logout: () => {
    logout();
  },

  // Get current user
  getCurrentUser: () => {
    return getCurrentUser();
  },

  // Check if authenticated
  isAuthenticated: () => {
    return isAuthenticated();
  },
};

// Sticker service functions
export const stickerService = {
  // Get all stickers (public)
  getAllStickers: async () => {
    return await apiGet("/api/stickers");
  },

  // Get sticker by ID (public)
  getStickerById: async (stickerId) => {
    return await apiGet(`/api/stickers/${stickerId}`);
  },

  // Add new sticker (admin only)
  addSticker: async (stickerData, imageFile) => {
    const formData = new FormData();
    formData.append("title", stickerData.title);
    formData.append("description", stickerData.description || "");
    formData.append("price", stickerData.price);
    if (imageFile) {
      formData.append("stickerImage", imageFile);
    }

    return await apiRequestWithFile("/api/stickers/create", formData);
  },

  // Delete sticker (admin only)
  deleteSticker: async (stickerId) => {
    const token = getToken();
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const fullUrl = `${baseUrl}/api/stickers/${stickerId}`;

    const res = await fetch(fullUrl, {
      method: "DELETE",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!res.ok) {
      if (res.status === 403) throw new Error("Admin access only");
      throw new Error(`Failed to delete sticker (HTTP ${res.status})`);
    }

    return await res.json();
  },

  // Update sticker (admin only)
  updateSticker: async (stickerId, stickerData, imageFile) => {
    const formData = new FormData();
    if (stickerData.title) formData.append("title", stickerData.title);
    if (stickerData.description !== undefined)
      formData.append("description", stickerData.description);
    if (stickerData.price) formData.append("price", stickerData.price);
    if (imageFile) formData.append("stickerImage", imageFile);

    const token = getToken();
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const fullUrl = `${baseUrl}/api/stickers/${stickerId}`;

    const res = await fetch(fullUrl, {
      method: "PUT",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!res.ok) {
      if (res.status === 403) throw new Error("Admin access only");
      throw new Error(`Failed to update sticker (HTTP ${res.status})`);
    }

    return await res.json();
  },
};

// Cart service functions
export const cartService = {
  // Add item to cart
  addToCart: async (stickerId, quantity) => {
    return await apiPost("/api/cart/add", { stickerId, quantity });
  },

  // Remove item from cart
  removeFromCart: async (stickerId) => {
    return await apiPost("/api/cart/remove", { stickerId });
  },

  // Update cart quantity
  updateCartQuantity: async (stickerId, quantity) => {
    return await apiPost("/api/cart/update", { stickerId, quantity });
  },

  // Get user's cart
  getCart: async () => {
    return await apiGet("/api/cart");
  },
};

// Order service functions
export const orderService = {
  // Place order
  placeOrder: async (orderData) => {
    return await apiPost("/api/orders", orderData);
  },

  // Get user's orders
  getUserOrders: async () => {
    return await apiGet("/api/orders/orders/me");
  },

  // Get all orders (admin only)
  getAllOrders: async () => {
    return await apiGet("/api/orders");
  },

  // Update order status (admin only)
  updateOrderStatus: async (orderId, status) => {
    return await apiPut(`/api/orders/${orderId}/status`, { status });
  },
};

// Export all services
export default {
  auth: authService,
  stickers: stickerService,
  cart: cartService,
  orders: orderService,
};
