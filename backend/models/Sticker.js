// models/Sticker.js
import mongoose from "mongoose";

const stickerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    imageUrl: { type: String, required: true },
    publicId: { type: String, required: true }, // fixed name
    price: { type: Number, required: true }, // added
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Sticker = mongoose.model("Sticker", stickerSchema);
export default Sticker;
