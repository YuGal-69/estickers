import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      sticker: { type: mongoose.Schema.Types.ObjectId, ref: "Sticker", required: true },
      quantity: { type: Number, required: true }
    }
  ],
  total: { type: Number, required: true },
  address: { type: String, required: true },
  status: { type: String, enum: ["pending", "confirmed", "shipped", "delivered"], default: "pending" },
  paymentMethod: { type: String, default: "COD" },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model("Order", orderSchema);
export default Order;