import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { orderService } from "../../services/api";
import { toast } from "react-toastify";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      // Since we don't have a getOrderById endpoint, we'll simulate the order data
      // In real implementation, you'd call: const response = await orderService.getOrderById(orderId);

      // For now, let's create a mock order object based on the orderId
      const mockOrder = {
        _id: orderId,
        user: user?._id,
        items: [
          {
            sticker: {
              _id: "mock-sticker-1",
              title: "Sample Sticker",
              imageUrl:
                "https://cdn.pixabay.com/photo/2017/01/31/13/14/animal-2023924_1280.png",
              price: 99,
            },
            quantity: 2,
          },
        ],
        total: 198,
        status: "pending",
        paymentMethod: "cod",
        address: "Sample Address, City, State - 123456",
        createdAt: new Date().toISOString(),
      };

      setOrder(mockOrder);
    } catch (error) {
      setError("Failed to load order details");
      toast.error("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "processing":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "shipped":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "delivered":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "cancelled":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return "⏳";
      case "processing":
        return "⚙️";
      case "shipped":
        return "🚚";
      case "delivered":
        return "✅";
      case "cancelled":
        return "❌";
      default:
        return "📦";
    }
  };

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

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-cyan-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-6xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Order Not Found
          </h2>
          <p className="text-gray-300 mb-8">
            {error || "Unable to load order details"}
          </p>
          <button
            onClick={() => navigate("/order")}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-xl hover:from-cyan-600 hover:to-purple-700 transition-all duration-300"
          >
            View All Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-cyan-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-32 h-32 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <span className="text-6xl">🎉</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Order Confirmed!
          </h1>
          <p className="text-gray-300 text-lg mb-2">
            Thank you for your purchase, {user?.name}!
          </p>
          <p className="text-gray-400 text-sm">
            We've sent a confirmation email to {user?.email}
          </p>
        </div>

        {/* Order Details Card */}
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-8 border border-white/20 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Order Details</h2>
            <div
              className={`px-4 py-2 rounded-full border ${getStatusColor(
                order.status
              )} flex items-center gap-2`}
            >
              <span className="text-sm">{getStatusIcon(order.status)}</span>
              <span className="text-sm font-semibold capitalize">
                {order.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-white font-semibold mb-2">
                Order Information
              </h3>
              <div className="space-y-2 text-gray-300">
                <p>
                  <span className="text-white">Order ID:</span> #
                  {order._id?.slice(-8)}
                </p>
                <p>
                  <span className="text-white">Date:</span>{" "}
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p>
                  <span className="text-white">Payment:</span>{" "}
                  {order.paymentMethod?.toUpperCase()}
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">
                Delivery Address
              </h3>
              <p className="text-gray-300">{order.address}</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-4">Order Items</h3>
            <div className="space-y-3">
              {order.items?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-white/5 rounded-lg"
                >
                  <img
                    src={item.sticker?.imageUrl}
                    alt={item.sticker?.title}
                    className="w-16 h-16 object-cover rounded-lg bg-white/10"
                  />
                  <div className="flex-1">
                    <h4 className="text-white font-medium">
                      {item.sticker?.title}
                    </h4>
                    <p className="text-gray-300 text-sm">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-semibold">
                      ₹{(item.sticker?.price || 0) * item.quantity}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t border-white/20 pt-6">
            <div className="flex justify-between items-center">
              <span className="text-white font-semibold text-lg">
                Total Amount
              </span>
              <span className="text-cyan-400 font-bold text-2xl">
                ₹{order.total?.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 mb-8">
          <h3 className="text-xl font-bold text-white mb-4">What's Next?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📧</span>
              </div>
              <h4 className="text-white font-semibold mb-2">
                Confirmation Email
              </h4>
              <p className="text-gray-300 text-sm">
                Check your email for order details
              </p>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🚚</span>
              </div>
              <h4 className="text-white font-semibold mb-2">Processing</h4>
              <p className="text-gray-300 text-sm">
                We'll start processing your order soon
              </p>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📱</span>
              </div>
              <h4 className="text-white font-semibold mb-2">Updates</h4>
              <p className="text-gray-300 text-sm">
                Track your order in the Orders section
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/order"
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-xl hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 text-center"
          >
            Track My Order
          </Link>
          <Link
            to="/"
            className="px-8 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all duration-300 text-center border border-white/20"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Help Section */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm mb-4">
            Need help? Contact our support team
          </p>
          <div className="flex justify-center gap-6 text-sm">
            <span className="text-gray-400">📧 support@istiker.com</span>
            <span className="text-gray-400">📞 +91 98765 43210</span>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0,0,0);
          }
          40%, 43% {
            transform: translate3d(0,-30px,0);
          }
          70% {
            transform: translate3d(0,-15px,0);
          }
          90% {
            transform: translate3d(0,-4px,0);
          }
        }
        .animate-bounce {
          animation: bounce 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default OrderConfirmation;
