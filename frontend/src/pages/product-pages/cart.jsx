import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { cartService } from "../../services/api";

const Cart = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  // Debug log
  // console.log("Cart component rendered", {
  //   isAuthenticated,
  //   pathname: location.pathname,
  //   search: location.search,
  //   hash: location.hash,
  // });

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      // console.log("Fetching cart data...");
      setLoading(true);
      setError("");
      const response = await cartService.getCart();
      // console.log("Cart response:", response);
      setCart(response?.cart || { items: [] });
    } catch (error) {
      console.error("Error fetching cart:", error);
      setError("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (stickerId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      setUpdating(true);
      setError("");
      await cartService.updateCartQuantity(stickerId, newQuantity);
      await fetchCart(); // Refresh cart data
    } catch (error) {
      setError("Failed to update quantity");
      console.error("Error updating quantity:", error);
    } finally {
      setUpdating(false);
    }
  };

  const removeItem = async (stickerId) => {
    try {
      setUpdating(true);
      setError("");
      await cartService.removeFromCart(stickerId);
      await fetchCart(); // Refresh cart data
    } catch (error) {
      setError("Failed to remove item");
      console.error("Error removing item:", error);
    } finally {
      setUpdating(false);
    }
  };

  const calculateTotals = () => {
    if (!cart?.items) return { subtotal: 0, tax: 0, total: 0 };

    const subtotal = cart.items.reduce((sum, item) => {
      return sum + (item.sticker?.price || 0) * item.quantity;
    }, 0);

    const tax = subtotal * 0.18; // 18% GST
    const total = subtotal + tax;

    return { subtotal, tax, total };
  };

  const CartItem = ({ item }) => {
    const [isRemoving, setIsRemoving] = useState(false);

    const handleRemove = async () => {
      setIsRemoving(true);
      await removeItem(item.sticker._id);
      setIsRemoving(false);
    };

    return (
      <div
        className={`relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-500 ${
          isRemoving ? "opacity-50 scale-95" : ""
        }`}
      >
        <div className="flex items-center gap-4">
          {/* Product Image */}
          <div className="relative">
            <img
              src={item.sticker?.imageUrl}
              alt={item.sticker?.title}
              className="w-20 h-20 object-cover rounded-xl bg-white/10"
            />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {item.quantity}
            </div>
          </div>

          {/* Product Details */}
          <div className="flex-1">
            <h3 className="text-white font-semibold text-lg mb-1">
              {item.sticker?.title}
            </h3>
            <p className="text-gray-300 text-sm mb-2">
              {item.sticker?.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-cyan-400 font-bold text-lg">
                ₹{item.sticker?.price}
              </span>

              {/* Quantity Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    updateQuantity(item.sticker._id, item.quantity - 1)
                  }
                  disabled={updating || item.quantity <= 1}
                  className="w-8 h-8 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 disabled:opacity-50 transition-all duration-200"
                >
                  -
                </button>
                <span className="text-white font-semibold min-w-[2rem] text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() =>
                    updateQuantity(item.sticker._id, item.quantity + 1)
                  }
                  disabled={updating}
                  className="w-8 h-8 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 disabled:opacity-50 transition-all duration-200"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Remove Button */}
          <button
            onClick={handleRemove}
            disabled={updating}
            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all duration-200 disabled:opacity-50"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>

        {/* Total for this item */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex justify-between items-center">
            <span className="text-gray-300 text-sm">Item Total</span>
            <span className="text-white font-bold">
              ₹{(item.sticker?.price || 0) * item.quantity}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const PriceSummary = ({ subtotal, tax, total }) => (
    <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
      <h3 className="text-xl font-semibold text-white mb-4">Order Summary</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Subtotal</span>
          <span className="text-white">₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Tax (18% GST)</span>
          <span className="text-white">₹{tax.toFixed(2)}</span>
        </div>
        <div className="border-t border-white/20 pt-3">
          <div className="flex justify-between items-center">
            <span className="text-white font-semibold text-lg">Total</span>
            <span className="text-cyan-400 font-bold text-xl">
              ₹{total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate("/checkout")}
        className="w-full mt-6 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-xl hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
      >
        Proceed to Checkout
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-cyan-900 flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          <div
            className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-cyan-400 rounded-full animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
          ></div>
        </div>
      </div>
    );
  }

  const { subtotal, tax, total } = calculateTotals();
  const cartItems = cart?.items || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-cyan-900 p-6">
      {/* Test Message
      <div className="max-w-7xl mx-auto mb-4">
        <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4 text-blue-300">
          <p className="font-semibold">🛒 Cart Page is working!</p>
          <p>
            Authentication: {isAuthenticated ? "Logged In" : "Not Logged In"}
          </p>
          <p>Cart Items: {cartItems.length}</p>
          <p>Total: ₹{total.toFixed(2)}</p>
        </div>
      </div> */}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Your Cart
          </h1>
          <p className="text-gray-300 text-lg">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in
            your cart
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300">
            {error}
          </div>
        )}

        {cartItems.length === 0 ? (
          /* Empty Cart */
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-6xl">🛒</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-300 mb-8">
              Start adding some awesome stickers to your cart!
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-xl hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
            >
              <span>Browse Stickers</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        ) : (
          /* Cart Items */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {cartItems.map((item, index) => (
                  <CartItem key={item.sticker._id || index} item={item} />
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <PriceSummary subtotal={subtotal} tax={tax} total={total} />
            </div>
          </div>
        )}

        {/* Continue Shopping */}
        {cartItems.length > 0 && (
          <div className="mt-8 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors duration-200"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Continue Shopping
            </Link>
          </div>
        )}
      </div>

      {/* Custom Animations */}
      <style>{`
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      .animate-slide-in {
        animation: slideIn 0.5s ease-out;
      }
    `}</style>
    </div>
  );
};

export default Cart;
