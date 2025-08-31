import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-hot-toast";
import {
  cartService,
  orderService,
  stickerService,
  testBackendConnection,
} from "../../services/api";

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    cartItems: 0,
    favoriteStickers: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [stickers, setStickers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [backendConnected, setBackendConnected] = useState(false);

  // ✅ Add to cart handler
  const handleAddToCart = async (sticker) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart!");
      return;
    }

    try {
      const res = await cartService.addToCart(sticker._id, 1);

      if (res.success) {
        toast.success(`Added '${sticker.title}' to cart!`);

        // Refresh cart count from backend to keep it correct
        const cartResponse = await cartService.getCart();
        const cartItems = cartResponse?.cart?.items?.length || 0;

        setStats((prev) => ({
          ...prev,
          cartItems,
        }));
      } else {
        toast.error("Failed to add item to cart.");
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Error adding item to cart.");
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // console.log("Fetching dashboard data...");

        // Test backend connection first
        const isConnected = await testBackendConnection();
        setBackendConnected(isConnected);
        // console.log("Backend connected:", isConnected);

        if (!isConnected) {
          setError(
            "Backend server is not running. Please start the backend server first."
          );
          setLoading(false);
          return;
        }

        // Fetch all stickers
        const stickersResponse = await stickerService.getAllStickers();
        setStickers(stickersResponse?.data || []);
        // console.log("Stickers fetched:", stickersResponse?.data?.length || 0);

        if (isAuthenticated) {
          // Fetch cart data
          const cartResponse = await cartService.getCart();
          const cartItems = cartResponse?.cart?.items?.length || 0;

          // Fetch recent orders
          const ordersResponse = await orderService.getUserOrders();
          const orders = ordersResponse?.orders || [];
          const totalSpent = orders.reduce(
            (sum, order) => sum + (order.total || 0),
            0
          );

          setStats({
            totalOrders: orders.length,
            totalSpent,
            cartItems,
            favoriteStickers: 0, // Placeholder
          });
          setRecentOrders(orders.slice(0, 3)); // Show last 3 orders
          // console.log("Dashboard data fetched successfully",
          //    {
          //   stats: { totalOrders: orders.length, totalSpent, cartItems },
          // });
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated]);

  const StatCard = ({ title, value, icon, color, delay }) => (
    <div
      className={`relative overflow-hidden rounded-2xl p-4 sm:p-6 backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-105 group`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative z-10">
        <div
          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${color} flex items-center justify-center mb-3 sm:mb-4`}
        >
          <span className="text-xl sm:text-2xl">{icon}</span>
        </div>
        <h3 className="text-lg sm:text-2xl font-bold text-white mb-1 sm:mb-2">
          {value}
        </h3>
        <p className="text-gray-300 text-xs sm:text-sm">{title}</p>
      </div>
    </div>
  );

  const QuickActionCard = ({ title, description, icon, link, color }) => (
    <Link to={link} className="block">
      <div
        className={`relative overflow-hidden rounded-2xl p-4 sm:p-6 backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-105 group cursor-pointer`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative z-10">
          <div
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${color} flex items-center justify-center mb-3 sm:mb-4`}
          >
            <span className="text-xl sm:text-2xl">{icon}</span>
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">
            {title}
          </h3>
          <p className="text-gray-300 text-xs sm:text-sm">{description}</p>
        </div>
      </div>
    </Link>
  );

  const OrderCard = ({ order }) => (
    <div className="relative overflow-hidden rounded-xl p-3 sm:p-4 backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-2 sm:mb-3">
        <div>
          <h4 className="text-white font-semibold text-sm sm:text-base">
            Order #{order._id?.slice(-6)}
          </h4>
          <p className="text-gray-300 text-xs sm:text-sm">
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div
          className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold w-fit ${
            order.status === "delivered"
              ? "bg-green-500/20 text-green-300"
              : order.status === "shipped"
              ? "bg-blue-500/20 text-blue-300"
              : order.status === "processing"
              ? "bg-yellow-500/20 text-yellow-300"
              : "bg-gray-500/20 text-gray-300"
          }`}
        >
          {order.status}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
        <span className="text-gray-300 text-xs sm:text-sm">
          {order.items?.length || 0} items
        </span>
        <span className="text-white font-semibold text-sm sm:text-base">
          ₹{order.total}
        </span>
      </div>
    </div>
  );

  // ✅ Sticker card with product link + add to cart
  const StickerCard = ({ sticker }) => (
    <div className="relative overflow-hidden rounded-2xl p-3 sm:p-4 backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
      <div className="flex flex-col items-center">
        {/* ✅ Clickable area goes to product details */}
        <Link
          to={`/product/${sticker._id}`}
          className="flex flex-col items-center w-full"
        >
          <img
            src={sticker.imageUrl}
            alt={sticker.title}
            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl bg-white/10 mb-2 sm:mb-3"
          />
          <h4 className="text-white font-semibold text-center mb-2 line-clamp-2 text-xs sm:text-sm">
            {sticker.title}
          </h4>
        </Link>
        <button
          onClick={() => handleAddToCart(sticker)}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 px-3 rounded-lg text-xs font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-cyan-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <div className="text-white text-lg">Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-cyan-900 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-white text-xl font-semibold mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-cyan-900 py-6 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto">
            Here's what's happening with your sticker collection and orders
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon="📦"
            color="bg-blue-500/20"
            delay={0}
          />
          <StatCard
            title="Total Spent"
            value={`₹${stats.totalSpent}`}
            icon="💰"
            color="bg-green-500/20"
            delay={100}
          />
          <StatCard
            title="Cart Items"
            value={stats.cartItems}
            icon="🛒"
            color="bg-yellow-500/20"
            delay={200}
          />
          <StatCard
            title="Available Stickers"
            value={stickers.length}
            icon="🎨"
            color="bg-pink-500/20"
            delay={300}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <QuickActionCard
            title="Browse Stickers"
            description="Discover new and trending stickers"
            icon="🎨"
            link="/"
            color="bg-purple-500/20"
          />
          <QuickActionCard
            title="View Cart"
            description="Check your shopping cart"
            icon="🛒"
            link="/cart"
            color="bg-yellow-500/20"
          />
          <QuickActionCard
            title="Track Orders"
            description="Monitor your order status"
            icon="📦"
            link="/order"
            color="bg-blue-500/20"
          />
        </div>

        {/* Stickers Section */}
        <div className="mb-6 sm:mb-8">
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-4 sm:p-6 border border-white/20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-white">
                Available Stickers ({stickers.length})
              </h3>
              <Link
                to="/"
                className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold"
              >
                View All →
              </Link>
            </div>
            {stickers.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                {stickers.slice(0, 6).map((sticker, index) => (
                  <StickerCard key={sticker._id || index} sticker={sticker} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎨</span>
                </div>
                <p className="text-gray-300">No stickers available</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders and Quick Stats */}
        {isAuthenticated && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-4 sm:p-6 border border-white/20">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">
                Recent Orders
              </h3>
              {recentOrders.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {recentOrders.map((order, index) => (
                    <OrderCard key={order._id || index} order={order} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📦</span>
                  </div>
                  <p className="text-gray-300 mb-2">No orders yet</p>
                  <Link
                    to="/"
                    className="text-cyan-400 hover:text-cyan-300 text-sm"
                  >
                    Start shopping →
                  </Link>
                </div>
              )}
            </div>

            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-4 sm:p-6 border border-white/20">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">
                Quick Stats
              </h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-white/5 rounded-lg gap-1 sm:gap-0">
                  <span className="text-gray-300 text-sm">
                    Average Order Value
                  </span>
                  <span className="text-white font-semibold text-sm">
                    ₹
                    {stats.totalOrders > 0
                      ? Math.round(stats.totalSpent / stats.totalOrders)
                      : 0}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-white/5 rounded-lg gap-1 sm:gap-0">
                  <span className="text-gray-300 text-sm">
                    Most Ordered Category
                  </span>
                  <span className="text-white font-semibold text-sm">
                    Cute Stickers
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-white/5 rounded-lg gap-1 sm:gap-0">
                  <span className="text-gray-300 text-sm">Member Since</span>
                  <span className="text-white font-semibold text-sm">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "Recently"}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-white/5 rounded-lg gap-1 sm:gap-0">
                  <span className="text-gray-300 text-sm">Total Stickers</span>
                  <span className="text-white font-semibold text-sm">
                    {stickers.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
