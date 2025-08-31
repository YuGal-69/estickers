// routes/stickerRoutes.js
import express from "express";
import {
  getAllStickers,
  getStickerById,
  addSticker,
  updateSticker,
  deleteSticker,
} from "../controllers/stickerController.js";
import { upload } from "../middleware/upload.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";

const router = express.Router();

/**
 * @route GET /api/stickers
 * @desc Public route - Get all stickers
 */
router.get("/", getAllStickers);

/**
 * @route GET /api/stickers/:id
 * @desc Public route - Get sticker by ID
 */
router.get("/:id", getStickerById);

/**
 * @route POST /api/stickers/create
 * @desc Admin only - Create a sticker
 * Accepts file under either `stickerImage` or `image`
 */
router.post(
  "/create",
  authMiddleware,
  adminMiddleware,
  upload.single("stickerImage"), // Default expected field
  addSticker
);

/**
 * @route PUT /api/stickers/:id
 * @desc Admin only - Update a sticker
 * Accepts file under either `stickerImage` or `image`
 */
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("stickerImage"), // Default expected field
  updateSticker
);

/**
 * @route DELETE /api/stickers/:id
 * @desc Admin only - Delete a sticker
 */
router.delete("/:id", authMiddleware, adminMiddleware, deleteSticker);

export default router;
