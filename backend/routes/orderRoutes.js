import express from "express";
import {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus
} from "../controllers/orderController.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Place order (user)
router.post("/", authMiddleware, placeOrder);

// Get logged-in user's orders
router.get("/me", authMiddleware, getUserOrders);

// Admin: get all orders
router.get("/", authMiddleware, adminMiddleware, getAllOrders);

// Admin: update order status
router.put("/:id/status", authMiddleware, adminMiddleware, updateOrderStatus);

export default router;
