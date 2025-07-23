import express from "express";
import { placeOrder, getUserOrders, getAllOrders, updateOrderStatus } from "../controllers/orderController.js";
import { verifyToken, verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

router.post("/", verifyToken, placeOrder);
router.get("/orders/me", verifyToken, getUserOrders);
router.get("/", verifyToken, verifyAdmin, getAllOrders);
router.put("/:id/status", verifyToken, verifyAdmin, updateOrderStatus);

export default router;
