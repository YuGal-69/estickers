import Cart from "../models/Cart.js";
import Sticker from "../models/Sticker.js";

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { stickerId, quantity } = req.body;
    if (!stickerId || quantity < 1) return res.status(400).json({ message: "Invalid input" });
    const sticker = await Sticker.findById(stickerId);
    if (!sticker) return res.status(404).json({ message: "Sticker not found" });
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [{ sticker: stickerId, quantity }] });
    } else {
      const itemIndex = cart.items.findIndex(item => item.sticker.toString() === stickerId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ sticker: stickerId, quantity });
      }
      await cart.save();
    }
    res.status(200).json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { stickerId } = req.body;
    let cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    cart.items = cart.items.filter(item => item.sticker.toString() !== stickerId);
    await cart.save();
    res.status(200).json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update quantity in cart
export const updateCartQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { stickerId, quantity } = req.body;
    if (quantity < 1) return res.status(400).json({ message: "Quantity must be at least 1" });
    let cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    const item = cart.items.find(item => item.sticker.toString() === stickerId);
    if (!item) return res.status(404).json({ message: "Item not found in cart" });
    item.quantity = quantity;
    await cart.save();
    res.status(200).json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get user's cart
// Get user's cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    let cart = await Cart.findOne({ user: userId }).populate("items.sticker");

    // If cart doesn't exist, return an empty one instead of null
    if (!cart) {
      return res.status(200).json({
        success: true,
        cart: { items: [], total: 0 }
      });
    }

    // Calculate total price (optional, if not stored in DB)
    const total = cart.items.reduce((sum, item) => {
      const price = item.sticker?.price || 0;
      return sum + price * item.quantity;
    }, 0);

    res.status(200).json({ success: true, cart: { ...cart.toObject(), total } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

