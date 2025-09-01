// models/Order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        sticker: { type: mongoose.Schema.Types.ObjectId, ref: "Sticker", required: true },
        quantity: { type: Number, required: true, min: 1 }
      }
    ],
    total: { type: Number, required: true },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true }
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending"
    },
    paymentMethod: { type: String, enum: ["COD", "Online"], default: "COD" }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
