import express from "express";
import { addToCart, removeFromCart, updateCartQuantity, getCart } from "../controllers/cartController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/add", verifyToken, addToCart);
router.post("/remove", verifyToken, removeFromCart);
router.post("/update", verifyToken, updateCartQuantity);
router.get("/", verifyToken, getCart);

export default router;
