// routes/stickerRoutes.js
import express from "express";
import {
  getAllStickers,
  addSticker,
  updateSticker,
  deleteSticker,
} from "../controllers/stickerController.js";
import { upload } from "../middleware/upload.js";
import { verifyToken, verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

router.post("/create", upload.single("stickerImage"), addSticker);
router.post("/", verifyToken, verifyAdmin, upload.single("image"), addSticker);
router.put(
  "/:id",
  verifyToken,
  verifyAdmin,
  upload.single("image"),
  updateSticker
);
router.delete("/:id", verifyToken, verifyAdmin, deleteSticker);
router.get("/", getAllStickers); // public route

export default router;
