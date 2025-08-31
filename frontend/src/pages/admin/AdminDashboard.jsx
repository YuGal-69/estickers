import React, { useEffect, useState } from "react";
import { stickerService, cartService } from "../../services/api";
import StickerCard from "../../components/StickerCard";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";

const AdminDashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const [stickers, setStickers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
  });
  const [image, setImage] = useState(null);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [cartTest, setCartTest] = useState("Testing cart functionality...");

  // ✅ Fetch stickers
  const fetchStickers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await stickerService.getAllStickers();
      setStickers(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      setError(err.message || "Failed to fetch stickers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStickers();
  }, []);

  // ✅ Clear messages after a delay
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Add / Update sticker
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (editId) {
        await stickerService.updateSticker(editId, form, image);
        setSuccess("Sticker updated successfully!");
      } else {
        await stickerService.addSticker(form, image);
        setSuccess("Sticker added successfully!");
      }

      // Reset
      setForm({ title: "", description: "", price: "" });
      setImage(null);
      setEditId(null);
      fetchStickers();
    } catch (err) {
      setError(err.message || "Failed to save sticker");
    } finally {
      setLoading(false);
    }
  };

  // Edit
  const handleEdit = (sticker) => {
    setForm({
      title: sticker.title,
      description: sticker.description,
      price: sticker.price,
    });
    setEditId(sticker._id);
    setImage(null);
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sticker?"))
      return;
    try {
      await stickerService.deleteSticker(id);
      setSuccess("Sticker deleted successfully!");
      fetchStickers();
    } catch (err) {
      setError(err.message || "Failed to delete sticker");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-cyan-900 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>

        {/* Cart Test Section */}
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-4 mb-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-2">
            Cart Functionality Test
          </h3>
          <div className="text-gray-300 text-sm mb-3 space-y-1">
            <p>
              Authentication:{" "}
              {isAuthenticated ? "✅ Logged In" : "❌ Not Logged In"}
            </p>
            <p>User: {user?.name || "No user data"}</p>
            <p>User ID: {user?._id || "No user ID"}</p>
            <p>Status: {cartTest}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                try {
                  const response = await cartService.getCart();
                  setCartTest(
                    `Cart test successful! Cart has ${
                      response?.cart?.items?.length || 0
                    } items`
                  );
                  toast.success("Cart test successful!");
                } catch (error) {
                  setCartTest(`Cart test failed: ${error.message}`);
                  toast.error("Cart test failed");
                }
              }}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg hover:from-green-600 hover:to-blue-700 transition-all duration-300"
            >
              Test Cart API
            </button>
            <button
              onClick={async () => {
                try {
                  // Test adding a specific sticker to cart
                  if (stickers.length > 0) {
                    const testSticker = stickers[0];
                    // console.log("Testing with sticker:", testSticker);
                    const response = await cartService.addToCart(
                      testSticker._id,
                      1
                    );
                    // console.log("Add to cart test response:", response);
                    setCartTest(`Add test successful: ${testSticker.title}`);
                    toast.success("Add to cart test successful!");
                  } else {
                    setCartTest("No stickers available for testing");
                  }
                } catch (error) {
                  console.error("Add to cart test error:", error);
                  setCartTest(`Add test failed: ${error.message}`);
                  toast.error("Add to cart test failed");
                }
              }}
              className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-lg hover:from-yellow-600 hover:to-orange-700 transition-all duration-300"
            >
              Test Add to Cart
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 mb-8 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4">
            {editId ? "Edit Sticker" : "Add New Sticker"}
          </h2>

          {error && (
            <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-4 bg-green-500/20 border border-green-500/30 rounded-xl text-green-300">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Sticker Title"
              required
              className="w-full border border-white/20 rounded-xl p-3 bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
            />
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full border border-white/20 rounded-xl p-3 bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
            />
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Price"
              required
              className="w-full border border-white/20 rounded-xl p-3 bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
            />
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full border border-white/20 rounded-xl p-3 bg-white/10 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-500 file:text-white hover:file:bg-cyan-600"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-xl hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Saving..."
                : editId
                ? "Update Sticker"
                : "Add Sticker"}
            </button>
          </form>
        </div>

        {/* Stickers List */}
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4">
            All Stickers
          </h2>
          {loading ? (
            <p className="text-gray-300 text-center">Loading stickers...</p>
          ) : stickers.length === 0 ? (
            <p className="text-gray-300 text-center">No stickers found.</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {stickers.map((sticker) => (
                <div
                  key={sticker._id}
                  className="backdrop-blur-xl bg-white/10 rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <StickerCard
                    sticker={sticker}
                    onAddToCart={async (sticker) => {
                      try {
                        // console.log("Adding sticker to cart:", sticker);
                        // console.log("Sticker ID:", sticker._id);

                        // Actually add the item to cart
                        const response = await cartService.addToCart(
                          sticker._id,
                          1
                        );
                        // console.log("Cart service response:", response);

                        if (response.success) {
                          // Show success message
                          toast.success(`${sticker.title} added to cart!`);
                          // console.log("Added to cart:", sticker.title);

                          // Update the cart test message to show it's working
                          setCartTest(
                            `Last added: ${sticker.title} - Cart functionality working!`
                          );
                        } else {
                          toast.error("Failed to add item to cart");
                          setCartTest(`Failed to add: ${sticker.title}`);
                        }
                      } catch (error) {
                        console.error("Error in onAddToCart callback:", error);
                        toast.error("Error adding item to cart");
                        setCartTest(`Error: ${error.message}`);
                      }
                    }}
                  />
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleEdit(sticker)}
                      className="px-3 py-2 rounded-lg text-white hover:scale-105 transition-all duration-200 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(sticker._id)}
                      className="px-3 py-2 rounded-lg text-white hover:scale-105 transition-all duration-200 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
