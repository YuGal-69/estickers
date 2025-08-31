import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { cartService } from "../services/api";
import { toast } from "react-toastify";

const StickerCard = ({ sticker, onAddToCart }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please login to add items to cart!");
      navigate("/login");
      return;
    }

    // If parent provides onAddToCart callback, use that
    if (onAddToCart) {
      try {
        await onAddToCart(sticker);
      } catch (error) {
        console.error("Error in parent add to cart:", error);
        toast.error("Error adding item to cart");
      }
      return;
    }

    // Otherwise, handle cart addition directly
    try {
      const response = await cartService.addToCart(sticker._id, 1);

      if (response.success) {
        toast.success("Added to cart successfully!");
      } else {
        toast.error("Failed to add item to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Error adding item to cart");
    }
  };

  return (
    <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-3 sm:p-4 flex flex-col items-center hover:scale-105 transition-all duration-300 w-full max-w-[280px] border border-white/20 relative group hover:bg-white/20 hover:shadow-lg">
      <img
        src={sticker.imageUrl}
        alt={sticker.title}
        className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 object-contain rounded-lg mb-2 sm:mb-3 bg-white/10 drop-shadow-md transition-transform duration-300 group-hover:scale-110"
      />
      <h3
        className="text-sm sm:text-base lg:text-lg font-bold text-white mb-1 text-center truncate w-full px-1"
        title={sticker.title}
      >
        {sticker.title}
      </h3>
      <p className="text-gray-300 text-xs sm:text-sm mb-2 text-center line-clamp-2 min-h-[2.5em] px-1">
        {sticker.description}
      </p>
      <span className="text-cyan-400 font-semibold text-sm sm:text-base mb-2">
        ₹{sticker.price}
      </span>
      <button
        className="mt-2 px-3 sm:px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold shadow hover:scale-105 hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-xs sm:text-sm w-full opacity-0 group-hover:opacity-100 group-focus:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleAddToCart}
        aria-label={`Add ${sticker.title} to cart`}
      >
        Add to Cart
      </button>

      {/* Mobile-friendly always-visible button for small screens */}
      <button
        className="mt-2 px-3 sm:px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold shadow hover:scale-105 hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-xs sm:text-sm w-full sm:hidden"
        onClick={handleAddToCart}
        aria-label={`Add ${sticker.title} to cart`}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default StickerCard;
