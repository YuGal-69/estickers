import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Sticker from "../models/Sticker.js";

// ✅ Place an order (COD)
export const placeOrder = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { address, items: requestItems, paymentMethod = "COD" } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User ID missing" });
    }

    if (!address || address.trim() === "") {
      return res.status(400).json({ message: "Address is required" });
    }

    if (!Array.isArray(requestItems) || requestItems.length === 0) {
      return res.status(400).json({ message: "Items are required" });
    }

    let total = 0;
    const items = [];

    for (const item of requestItems) {
      const sticker = await Sticker.findById(item.sticker);

      if (!sticker) {
        return res.status(400).json({ message: "Invalid sticker in items" });
      }

      const quantity = Number(item.quantity);

      if (isNaN(quantity) || quantity <= 0) {
        return res.status(400).json({ message: "Invalid quantity for sticker" });
      }

      if (typeof sticker.price !== "number") {
        return res.status(400).json({ message: "Invalid sticker price" });
      }

      total += sticker.price * quantity;

      items.push({
        sticker: sticker._id,
        quantity: quantity,
      });
    }

    // Create the order
    const order = await Order.create({
      user: userId,
      items,
      total,
      address,
      paymentMethod,
      status: "pending",
    });

    return res.status(201).json({ success: true, order });
  } catch (err) {
    console.error("Order placement error:", err);
    return res.status(500).json({ message: err.message });
  }
};

// ✅ Get orders for the current user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const orders = await Order.find({ user: userId }).populate("items.sticker");
    return res.status(200).json({ success: true, orders });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ✅ Admin: Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("items.sticker user");
    return res.status(200).json({ success: true, orders });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


// ✅ Admin: Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "confirmed", "shipped", "delivered"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({ success: true, order });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

