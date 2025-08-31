import express from "express";
import {
  addToCart,
  removeFromCart,
  updateCartQuantity,
  getCart
} from "../controllers/cartController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/add", authMiddleware, addToCart);
router.post("/remove", authMiddleware, removeFromCart);
router.post("/update", authMiddleware, updateCartQuantity);
router.get("/", authMiddleware, getCart);

export default router;
