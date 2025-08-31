import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { orderService } from "../../services/api";
import { toast } from "react-toastify";

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  useEffect(() => {
    if (user) {
      fetchUserOrders();
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getUserOrders();
      setOrders(response?.orders || []);
    } catch (error) {
      setError("Failed to load orders");
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    // In real implementation, you'd call an API to update profile
    toast.success("Profile updated successfully!");
    setEditMode(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            My Profile
          </h1>
          <p className="text-gray-300 text-lg">
            Manage your account and view your orders
          </p>
        </div>

        {/* Profile Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="backdrop-blur-xl bg-white/10 rounded-xl p-4 border border-white/20 text-center">
            <div className="text-2xl font-bold text-white">{orders.length}</div>
            <div className="text-gray-300 text-sm">Total Orders</div>
          </div>
          <div className="backdrop-blur-xl bg-white/10 rounded-xl p-4 border border-white/20 text-center">
            <div className="text-2xl font-bold text-cyan-400">
              ₹
              {orders
                .reduce((sum, order) => sum + (order.total || 0), 0)
                .toFixed(2)}
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
                    order.status === "pending" || order.status === "processing"
                ).length
              }
            </div>
            <div className="text-gray-300 text-sm">In Progress</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 overflow-hidden">
          {/* Tab Headers */}
          <div className="flex border-b border-white/20">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 px-6 py-4 text-center font-semibold transition-colors ${
                activeTab === "profile"
                  ? "bg-white/20 text-white border-b-2 border-cyan-400"
                  : "text-gray-300 hover:text-white hover:bg-white/10"
              }`}
            >
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex-1 px-6 py-4 text-center font-semibold transition-colors ${
                activeTab === "orders"
                  ? "bg-white/20 text-white border-b-2 border-cyan-400"
                  : "text-gray-300 hover:text-white hover:bg-white/10"
              }`}
            >
              Order History
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`flex-1 px-6 py-4 text-center font-semibold transition-colors ${
                activeTab === "settings"
                  ? "bg-white/20 text-white border-b-2 border-cyan-400"
                  : "text-gray-300 hover:text-white hover:bg-white/10"
              }`}
            >
              Account Settings
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">
                    Personal Information
                  </h2>
                  <button
                    onClick={() => setEditMode(!editMode)}
                    className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                  >
                    {editMode ? "Cancel" : "Edit Profile"}
                  </button>
                </div>

                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            name: e.target.value,
                          })
                        }
                        disabled={!editMode}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        disabled
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white opacity-50 cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            phone: e.target.value,
                          })
                        }
                        disabled={!editMode}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        Address
                      </label>
                      <textarea
                        value={profileData.address}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            address: e.target.value,
                          })
                        }
                        disabled={!editMode}
                        rows="3"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  {editMode && (
                    <div className="flex gap-4">
                      <button
                        type="submit"
                        className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-purple-700 transition-all duration-300"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditMode(false)}
                        className="px-6 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-300"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Recent Orders</h2>

                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl">📦</span>
                    </div>
                    <p className="text-gray-300 mb-4">No orders yet</p>
                    <button
                      onClick={() => navigate("/")}
                      className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-purple-700 transition-all duration-300"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order, index) => (
                      <div
                        key={order._id || index}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                        onClick={() => navigate(`/order`)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">📦</span>
                          </div>
                          <div>
                            <div className="text-white font-medium">
                              Order #{order._id?.slice(-8)}
                            </div>
                            <div className="text-gray-300 text-sm">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-semibold">
                            ₹{order.total}
                          </div>
                          <div
                            className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </div>
                        </div>
                      </div>
                    ))}

                    {orders.length > 5 && (
                      <div className="text-center pt-4">
                        <button
                          onClick={() => navigate("/order")}
                          className="text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                          View All Orders →
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">
                  Account Settings
                </h2>

                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-lg">
                    <h3 className="text-white font-semibold mb-2">
                      Change Password
                    </h3>
                    <p className="text-gray-300 text-sm mb-3">
                      Update your account password for enhanced security
                    </p>
                    <button className="px-4 py-2 bg-white/10 text-white border border-white/20 rounded-lg hover:bg-white/20 transition-colors">
                      Change Password
                    </button>
                  </div>

                  <div className="p-4 bg-white/5 rounded-lg">
                    <h3 className="text-white font-semibold mb-2">
                      Notification Preferences
                    </h3>
                    <p className="text-gray-300 text-sm mb-3">
                      Manage your email and push notification settings
                    </p>
                    <button className="px-4 py-2 bg-white/10 text-white border border-white/20 rounded-lg hover:bg-white/20 transition-colors">
                      Manage Notifications
                    </button>
                  </div>

                  <div className="p-4 bg-white/5 rounded-lg">
                    <h3 className="text-white font-semibold mb-2">
                      Privacy Settings
                    </h3>
                    <p className="text-gray-300 text-sm mb-3">
                      Control your data privacy and sharing preferences
                    </p>
                    <button className="px-4 py-2 bg-white/10 text-white border border-white/20 rounded-lg hover:bg-white/20 transition-colors">
                      Privacy Settings
                    </button>
                  </div>

                  <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                    <h3 className="text-red-300 font-semibold mb-2">
                      Danger Zone
                    </h3>
                    <p className="text-red-300 text-sm mb-3">
                      Permanently delete your account and all associated data
                    </p>
                    <button className="px-4 py-2 bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors">
                      Delete Account
                    </button>
                  </div>
                </div>

                {/* Logout Button */}
                <div className="pt-6 border-t border-white/20">
                  <button
                    onClick={handleLogout}
                    className="w-full px-6 py-3 bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
