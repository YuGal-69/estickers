import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { stickerService, cartService } from "../../services/api";
import { toast } from "react-toastify";
import StickerCard from "../../components/StickerCard";

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    if (productId) {
      fetchProduct();
      fetchRelatedProducts();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError("");

      // Try to fetch real product data
      const response = await stickerService.getStickerById(productId);

      if (response.success && response.data) {
        setProduct(response.data);
      } else {
        throw new Error(response.message || "Failed to load product");
      }
    } catch (error) {
      console.error("Error fetching product:", error);

      // Fallback to mock data if API fails
      const mockProduct = {
        _id: productId,
        title: "Amazing Sticker Collection",
        description:
          "This is a beautiful and high-quality sticker that will add personality to any surface. Perfect for laptops, water bottles, notebooks, and more. Made with premium vinyl material that's durable and long-lasting.",
        price: 149,
        imageUrl:
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop&crop=center",
        category: "Animals",
        stock: 50,
        rating: 4.5,
        reviews: 23,
        tags: ["cute", "animals", "trending", "new"],
      };

      setProduct(mockProduct);
      setError("Using demo data - API connection failed");
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      // Fetch related products (similar category or tags)
      const response = await stickerService.getAllStickers();
      const allProducts = response?.data || [];
      // Filter out current product and get first 4 related ones
      const related = allProducts
        .filter((p) => p._id !== productId)
        .slice(0, 4);
      setRelatedProducts(related);
    } catch (error) {
      console.error("Failed to fetch related products:", error);
      // Set some mock related products if API fails
      setRelatedProducts([
        {
          _id: "related1",
          title: "Cute Cat Sticker",
          imageUrl:
            "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&h=300&fit=crop&crop=center",
          price: 99,
        },
        {
          _id: "related2",
          title: "Funny Dog Sticker",
          imageUrl:
            "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=300&h=300&fit=crop&crop=center",
          price: 129,
        },
        {
          _id: "related3",
          title: "Cool Panda Sticker",
          imageUrl:
            "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=300&h=300&fit=crop&crop=center",
          price: 149,
        },
        {
          _id: "related4",
          title: "Adorable Bunny Sticker",
          imageUrl:
            "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=300&h=300&fit=crop&crop=center",
          price: 119,
        },
      ]);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart!");
      navigate("/login");
      return;
    }

    try {
      setAddingToCart(true);
      const response = await cartService.addToCart(product._id, quantity);

      if (response.success) {
        toast.success(
          `Added ${quantity} ${quantity === 1 ? "item" : "items"} to cart!`
        );
        // Optionally navigate to cart
        // navigate("/cart");
      } else {
        toast.error("Failed to add item to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Error adding item to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.error("Please login to purchase!");
      navigate("/login");
      return;
    }

    // Add to cart and navigate to checkout
    handleAddToCart().then(() => {
      navigate("/checkout");
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-cyan-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <div className="text-white text-lg">Loading product details...</div>
        </div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-cyan-900 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-32 h-32 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-6xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Product Not Found
          </h2>
          <p className="text-gray-300 mb-8">
            {error || "Unable to load product details"}
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-xl hover:from-cyan-600 hover:to-purple-700 transition-all duration-300"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-cyan-900 py-6 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Error Banner for Demo Data */}
        {error && (
          <div className="mb-6 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-xl text-yellow-300">
            <div className="flex items-center gap-2">
              <span className="text-yellow-400">⚠️</span>
              <p className="text-sm">
                <strong>Demo Mode:</strong> {error}. This is sample data for
                demonstration purposes.
              </p>
            </div>
          </div>
        )}

        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex text-sm text-gray-300">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link to="/" className="hover:text-white transition-colors">
              Stickers
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">{product.title}</span>
          </nav>
        </div>

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12 lg:mb-16">
          {/* Product Image */}
          <div className="space-y-4 sm:space-y-6">
            <div className="relative group">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-64 sm:h-80 lg:h-96 object-contain rounded-2xl bg-white/10 border border-white/20 group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop&crop=center";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* Image Gallery Placeholder */}
            <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 border border-white/20 rounded-lg cursor-pointer hover:border-cyan-400 transition-colors flex-shrink-0"
                >
                  <img
                    src={product.imageUrl}
                    alt={`${product.title} ${i}`}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop&crop=center";
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                {product.title}
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className="text-yellow-400 text-sm sm:text-base"
                    >
                      {i < Math.floor(product.rating || 4.5) ? "★" : "☆"}
                    </span>
                  ))}
                  <span className="text-gray-300 ml-2 text-sm sm:text-base">
                    ({product.reviews || 23} reviews)
                  </span>
                </div>
                <span className="px-3 py-1 bg-green-500/20 text-green-300 border border-green-500/30 rounded-full text-xs sm:text-sm w-fit">
                  {product.stock > 0
                    ? `${product.stock} in stock`
                    : "Out of stock"}
                </span>
              </div>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-bold text-cyan-400 mb-2">
                ₹{product.price}
              </div>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {(product.tags || ["cute", "trending", "new"]).map(
                (tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white/10 text-white border border-white/20 rounded-full text-xs sm:text-sm hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                )
              )}
            </div>

            {/* Quantity Selector */}
            <div className="space-y-3 sm:space-y-4">
              <label className="block text-white text-sm font-medium">
                Quantity
              </label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div className="flex items-center border border-white/20 rounded-lg bg-white/10">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="px-3 sm:px-4 py-2 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    -
                  </button>
                  <span className="px-3 sm:px-4 py-2 text-white font-semibold min-w-[2.5rem] sm:min-w-[3rem] text-center text-sm sm:text-base">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= (product.stock || 50)}
                    className="px-3 sm:px-4 py-2 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-gray-300 text-sm">
                  {product.stock || 50} available
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 sm:space-y-4">
              <button
                onClick={handleAddToCart}
                disabled={addingToCart || (product.stock || 50) === 0}
                className="w-full py-3 sm:py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {addingToCart ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    Adding to Cart...
                  </div>
                ) : (
                  "Add to Cart"
                )}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={addingToCart || (product.stock || 50) === 0}
                className="w-full py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-xl hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mb-12 lg:mb-16">
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-4 sm:p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Related Stickers
              </h2>
              <Link
                to="/"
                className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold"
              >
                View All →
              </Link>
            </div>

            {relatedProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {relatedProducts.map((sticker) => (
                  <div key={sticker._id} className="relative group">
                    <Link to={`/product/${sticker._id}`}>
                      <StickerCard
                        sticker={sticker}
                        onAddToCart={() => {}} // Empty function since we're just displaying
                      />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎨</span>
                </div>
                <p className="text-gray-300">No related stickers found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
