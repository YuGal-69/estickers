import Sticker from "../models/Sticker.js";
import { stickerSchema } from "../validators/stickerValidation.js";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

// GET all stickers (Public)
export const getAllStickers = async (req, res) => {
  try {
    const stickers = await Sticker.find();
    res
      .status(200)
      .json({ success: true, count: stickers.length, data: stickers });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch stickers" });
  }
};

// ADD new sticker (Admin Only, with image upload)
// controllers/stickerController.js
export const addSticker = async (req, res) => {
  try {
    const { title, description, price } = req.body;

    if (!req.file)
      return res.status(400).json({ success: false, message: "Image required" });

    // req.file.path or req.file.url contains the Cloudinary URL
    // req.file.filename or req.file.public_id contains the Cloudinary public ID
    const newSticker = await Sticker.create({
      title,
      description,
      price,
      imageUrl: req.file.path || req.file.url, // use whichever is available
      publicId: req.file.filename || req.file.public_id, // use whichever is available
      uploadedBy: req.user?.id || null,
    });

    res.status(201).json({ success: true, message: "Sticker added", data: newSticker });
  } catch (error) {
    console.error("Add Sticker Error:", error.message);
    res.status(500).json({ success: false, message: "Failed to add sticker" });
  }
};


// UPDATE sticker (Admin Only, image optional)
export const updateSticker = async (req, res) => {
  try {
    const { id } = req.params;
    const validated = stickerSchema.partial().parse(req.body); // partial allows optional fields

    const updated = await Sticker.findByIdAndUpdate(
      id,
      {
        ...validated,
        ...(req.file && { imageUrl: req.file.path }),
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Sticker not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Sticker updated", data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE sticker (Admin Only)
export const deleteSticker = async (req, res) => {
  const { id } = req.params;
  try {
    const sticker = await Sticker.findById(id);
    if (!sticker) return res.status(404).json({ message: "Sticker not found" });

    // Delete image from Cloudinary
    if (sticker.publicId) {
      await cloudinary.uploader.destroy(sticker.publicId);
    }

    // Delete from DB
    await Sticker.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Sticker deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete sticker" });
  }
};

