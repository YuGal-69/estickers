import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  sticker: { type: mongoose.Schema.Types.ObjectId, ref: "Sticker", required: true },
  quantity: { type: Number, default: 1, min: 1 }
});

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  items: [cartItemSchema]
});

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;