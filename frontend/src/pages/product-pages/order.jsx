import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { orderService } from "../../services/api";

const Order = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Debug log
  // console.log("Order component rendered", {
  //   isAuthenticated,
  //   pathname: location.pathname,
  //   search: location.search,
  //   hash: location.hash,
  // });

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      // console.log("Fetching orders data...");
      setLoading(true);
      setError("");
      const response = await orderService.getUserOrders();
      // console.log("Orders response:", response);
      setOrders(response?.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders");
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

  const OrderTimeline = ({ order }) => {
    const statuses = ["pending", "processing", "shipped", "delivered"];
    const currentIndex = statuses.indexOf(order.status);

    return (
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          {statuses.map((status, index) => (
            <div key={status} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                  index <= currentIndex
                    ? "bg-cyan-500 text-white"
                    : "bg-white/10 text-gray-400"
                }`}
              >
                {index <= currentIndex ? getStatusIcon(status) : "○"}
              </div>
              <span
                className={`text-xs mt-2 capitalize ${
                  index <= currentIndex ? "text-white" : "text-gray-400"
                }`}
              >
                {status}
              </span>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="relative h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-1000 ease-out"
            style={{
              width: `${((currentIndex + 1) / statuses.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>
    );
  };

  const OrderCard = ({ order }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const totalItems =
      order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    return (
      <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-500">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white font-semibold text-lg">
                Order #{order._id?.slice(-8)}
              </h3>
              <p className="text-gray-300 text-sm">
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

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

          {/* Order Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{totalItems}</div>
              <div className="text-gray-300 text-xs">Items</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">
                ₹{order.total}
              </div>
              <div className="text-gray-300 text-xs">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {order.items?.length || 0}
              </div>
              <div className="text-gray-300 text-xs">Products</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {order.paymentMethod}
              </div>
              <div className="text-gray-300 text-xs">Payment</div>
            </div>
          </div>

          {/* Expand/Collapse Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full py-3 text-cyan-400 hover:text-cyan-300 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <span>{isExpanded ? "Hide Details" : "View Details"}</span>
            <svg
              className={`w-5 h-5 transition-transform duration-300 ${
                isExpanded ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Expanded Details */}
          {isExpanded && (
            <div className="mt-6 pt-6 border-t border-white/10 space-y-6">
              {/* Timeline */}
              <div>
                <h4 className="text-white font-semibold mb-3">
                  Order Progress
                </h4>
                <OrderTimeline order={order} />
              </div>

              {/* Items */}
              <div>
                <h4 className="text-white font-semibold mb-3">Order Items</h4>
                <div className="space-y-3">
                  {order.items?.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 bg-white/5 rounded-lg"
                    >
                      <img
                        src={item.sticker?.imageUrl}
                        alt={item.sticker?.title}
                        className="w-12 h-12 object-cover rounded-lg bg-white/10"
                      />
                      <div className="flex-1">
                        <h5 className="text-white font-medium">
                          {item.sticker?.title}
                        </h5>
                        <p className="text-gray-300 text-sm">
                          {item.sticker?.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-semibold">
                          ₹{item.sticker?.price}
                        </div>
                        <div className="text-gray-300 text-sm">
                          Qty: {item.quantity}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Address */}
              <div>
                <h4 className="text-white font-semibold mb-3">
                  Delivery Address
                </h4>
                <div className="p-4 bg-white/5 rounded-lg text-gray-300 space-y-1">
                  <p>{order.address?.street}</p>
                  <p>
                    {order.address?.city}, {order.address?.state}{" "}
                    {order.address?.postalCode}
                  </p>
                  <p>{order.address?.country}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button className="flex-1 py-3 px-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-purple-700 transition-all duration-300">
                  Track Package
                </button>
                <button className="flex-1 py-3 px-4 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-300">
                  Reorder
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-cyan-900 p-6">
      {/* Test Message
      <div className="max-w-7xl mx-auto mb-4">
        <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-4 text-purple-300">
          <p className="font-semibold">📦 Order Page is working!</p>
          <p>
            Authentication: {isAuthenticated ? "Logged In" : "Not Logged In"}
          </p>
          <p>Total Orders: {orders.length}</p>
          <p>
            Total Spent: ₹
            {orders.reduce((sum, order) => sum + (order.total || 0), 0)}
          </p>
        </div>
      </div> */}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Your Orders
          </h1>
          <p className="text-gray-300 text-lg">
            Track your order status and delivery progress
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          /* Empty Orders */
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-6xl">📦</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              No orders yet
            </h2>
            <p className="text-gray-300 mb-8">
              Start shopping to see your orders here!
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-xl hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
            >
              <span>Start Shopping</span>
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
          /* Orders List */
          <div className="space-y-6">
            {orders.map((order, index) => (
              <OrderCard key={order._id || index} order={order} />
            ))}
          </div>
        )}

        {/* Order Stats */}
        {orders.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="backdrop-blur-xl bg-white/10 rounded-xl p-4 border border-white/20 text-center">
              <div className="text-2xl font-bold text-white">
                {orders.length}
              </div>
              <div className="text-gray-300 text-sm">Total Orders</div>
            </div>
            <div className="backdrop-blur-xl bg-white/10 rounded-xl p-4 border border-white/20 text-center">
              <div className="text-2xl font-bold text-cyan-400">
                ₹{orders.reduce((sum, order) => sum + (order.total || 0), 0)}
              </div>
              <div className="text-gray-300 text-sm">Total Spent</div>
            </div>
            <div className="backdrop-blur-xl bg-white/10 rounded-xl p-4 border border-white/20 text-center">
              <div className="text-2xl font-bold text-green-400">
                {orders.filter((order) => order.status === "delivered").length}
              </div>
              <div className="text-gray-300 text-sm">Delivered</div>
            </div>
            <div className="backdrop-blur-xl bg-white/10 rounded-xl p-4 border border-white/20 text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {
                  orders.filter(
                    (order) =>
                      order.status === "pending" ||
                      order.status === "processing"
                  ).length
                }
              </div>
              <div className="text-gray-300 text-sm">In Progress</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;
