import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Sticker from "../models/Sticker.js";

// ✅ Place an order (COD)
export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { address, paymentMethod, items } = req.body;

    // 1️⃣ Validate fields
    if (!address || !paymentMethod || !items || items.length === 0) {
      return res.status(400).json({
        message: "Address, payment method, and items are required"
      });
    }

    // 2️⃣ Validate stickers & calculate total
    let total = 0;
    for (const item of items) {
      const sticker = await Sticker.findById(item.sticker);
      if (!sticker) {
        return res.status(404).json({ message: `Sticker not found: ${item.sticker}` });
      }
      if (sticker.stock < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${sticker.title}. Available: ${sticker.stock}`
        });
      }
      total += sticker.price * item.quantity;
    }

    // 3️⃣ Create order
    const order = await Order.create({
      user: userId,
      items,
      total,
      address,
      status: "pending",
      paymentMethod
    });

    // 4️⃣ Deduct stock
    for (const item of items) {
      await Sticker.findByIdAndUpdate(item.sticker, {
        $inc: { stock: -item.quantity }
      });
    }

    return res.status(201).json({ success: true, order });
  } catch (error) {
    console.error("Place order error:", error);
    res.status(500).json({ message: "Internal server error" });
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


export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body || {}; // ✅ Prevent destructure error

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



