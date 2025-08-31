import React, { useState } from "react";

const SearchAndFilter = ({
  onSearch,
  onFilterChange,
  onSortChange,
  onPriceRangeChange,
  categories = [],
  priceRange = { min: 0, max: 1000 },
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleCategoryToggle = (category) => {
    const updated = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    setSelectedCategories(updated);
    onFilterChange({ categories: updated, priceRange, sortBy });
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    onSortChange(value);
  };

  const handlePriceRangeChange = (type, value) => {
    const newRange = { ...priceRange, [type]: value };
    setPriceRange(newRange);
    onPriceRangeChange(newRange);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSortBy("newest");
    setPriceRange({ min: 0, max: 1000 });
    setSearchTerm("");
    onFilterChange({
      categories: [],
      priceRange: { min: 0, max: 1000 },
      sortBy: "newest",
    });
    onSearch("");
  };

  return (
    <div className="w-full mb-8">
      {/* Search Bar */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="relative">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search stickers by name, description, or tags..."
              className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-lg"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-purple-700 transition-all duration-300"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white border border-white/20 rounded-lg hover:bg-white/20 transition-colors"
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
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L6.293 13.293A1 1 0 016 12.586V6.586a1 1 0 00-.293-.707L3.293 3.293A1 1 0 003 2.586V4z"
            />
          </svg>
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-4">
          <label className="text-white text-sm font-medium">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
          </select>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Categories */}
            <div>
              <h3 className="text-white font-semibold mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label
                    key={category}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                      className="w-4 h-4 text-cyan-500 bg-white/10 border-white/20 rounded focus:ring-cyan-400"
                    />
                    <span className="text-gray-300 hover:text-white transition-colors">
                      {category}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="text-white font-semibold mb-3">Price Range</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-gray-300 text-sm mb-1">
                    Min Price
                  </label>
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) =>
                      handlePriceRangeChange("min", Number(e.target.value))
                    }
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-1">
                    Max Price
                  </label>
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) =>
                      handlePriceRangeChange("max", Number(e.target.value))
                    }
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    placeholder="1000"
                  />
                </div>
              </div>
            </div>

            {/* Quick Filters */}
            <div>
              <h3 className="text-white font-semibold mb-3">Quick Filters</h3>
              <div className="space-y-2">
                <button
                  onClick={() =>
                    onFilterChange({
                      categories: ["Trending"],
                      priceRange,
                      sortBy,
                    })
                  }
                  className="w-full text-left px-3 py-2 bg-white/10 text-gray-300 hover:text-white rounded-lg transition-colors"
                >
                  🔥 Trending
                </button>
                <button
                  onClick={() =>
                    onFilterChange({ categories: ["New"], priceRange, sortBy })
                  }
                  className="w-full text-left px-3 py-2 bg-white/10 text-gray-300 hover:text-white rounded-lg transition-colors"
                >
                  ✨ New Arrivals
                </button>
                <button
                  onClick={() =>
                    onFilterChange({
                      categories: [],
                      priceRange: { min: 0, max: 100 },
                      sortBy,
                    })
                  }
                  className="w-full text-left px-3 py-2 bg-white/10 text-gray-300 hover:text-white rounded-lg transition-colors"
                >
                  💰 Under ₹100
                </button>
                <button
                  onClick={() =>
                    onFilterChange({
                      categories: [],
                      priceRange: { min: 100, max: 500 },
                      sortBy,
                    })
                  }
                  className="w-full text-left px-3 py-2 bg-white/10 text-gray-300 hover:text-white rounded-lg transition-colors"
                >
                  💎 Premium (₹100-500)
                </button>
              </div>
            </div>
          </div>

          {/* Clear Filters Button */}
          <div className="mt-6 pt-4 border-t border-white/20">
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {(selectedCategories.length > 0 ||
        priceRange.min > 0 ||
        priceRange.max < 1000) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {selectedCategories.map((category) => (
            <span
              key={category}
              className="px-3 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-full text-sm flex items-center gap-2"
            >
              {category}
              <button
                onClick={() => handleCategoryToggle(category)}
                className="hover:text-white transition-colors"
              >
                ×
              </button>
            </span>
          ))}
          {(priceRange.min > 0 || priceRange.max < 1000) && (
            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full text-sm flex items-center gap-2">
              ₹{priceRange.min} - ₹{priceRange.max}
              <button
                onClick={() => setPriceRange({ min: 0, max: 1000 })}
                className="hover:text-white transition-colors"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}

      {/* Custom Animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SearchAndFilter;
