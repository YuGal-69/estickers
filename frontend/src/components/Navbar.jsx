import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setOpen(false);
  };

  const publicNavLinks = [
    { name: "Home", to: "/" },
    { name: "Login", to: "/login" },
    { name: "Sign Up", to: "/signup" },
  ];

  const privateNavLinks = [
    { name: "Home", to: "/" },
    { name: "Dashboard", to: "/dashboard" },
    { name: "Cart", to: "/cart" },
    { name: "Orders", to: "/order" },
    { name: "Profile", to: "/profile" },
  ];

  const navLinks = isAuthenticated ? privateNavLinks : publicNavLinks;

  return (
    <>
      <nav 
        className={`fixed w-full z-50 top-0 left-0 transition-all duration-300 ${
          scrolled
            ? "bg-white/98 backdrop-blur-xl shadow-xl border-b border-purple-200/50"
            : "bg-white/95 backdrop-blur-lg shadow-lg border-b border-purple-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo - Responsive sizing */}
            <Link
              to="/"
              className="flex items-center gap-2 sm:gap-3 group flex-shrink-0"
            >
              <div className="relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 flex items-center justify-center">
                  <span className="text-white text-sm sm:text-lg lg:text-xl font-bold">
                    C
                  </span>
                </div>
                <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
              </div>
              <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 group-hover:from-purple-700 group-hover:via-pink-700 group-hover:to-cyan-700 transition-all duration-300">
                Creatistick
              </span>
            </Link>

            {/* Desktop Navigation - Hidden on mobile */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-base lg:text-lg font-semibold transition-all duration-300 px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 hover:text-purple-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-300 transform hover:scale-105 ${
                    location.pathname === link.to
                      ? "bg-gradient-to-r from-purple-200 to-pink-200 text-purple-800 shadow-md"
                      : "text-gray-700 hover:text-purple-700"
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {/* Logout button for authenticated users */}
              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="text-base lg:text-lg font-semibold transition-all duration-300 px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-red-100 hover:to-pink-100 hover:text-red-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-300 text-gray-700 transform hover:scale-105"
                >
                  Logout
                </button>
              )}
            </div>

            {/* User Info - Hidden on mobile */}
            {isAuthenticated && user && (
              <div className="hidden lg:flex items-center gap-4">
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full border border-purple-200 shadow-sm">
                  <span className="text-sm font-medium text-purple-700">
                    Welcome, {user.name}! 👋
                  </span>
                </div>
              </div>
            )}

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-3">
              {/* Show user info on mobile when authenticated */}
              {isAuthenticated && user && (
                <div className="hidden sm:flex items-center">
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1.5 rounded-full border border-purple-200">
                    <span className="text-xs font-medium text-purple-700">
                      Hi, {user.name.split(" ")[0]}! 👋
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={() => setOpen(!open)}
                className="text-gray-700 hover:text-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-300 p-2 rounded-lg hover:bg-purple-50 transition-all duration-200"
                aria-label="Toggle menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={
                      open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
                    }
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {open && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm lg:hidden z-40"
              onClick={() => setOpen(false)}
            />

            {/* Mobile Menu */}
            <div className="lg:hidden absolute top-full left-0 right-0 bg-white/98 backdrop-blur-xl shadow-2xl border-t border-purple-200/50 animate-slide-down z-50">
              <div className="px-4 py-6 space-y-3 bg-white/95 backdrop-blur-2xl shadow-2xl border-t border-white/20 rounded-b-2xl">
                {/* User info for mobile */}
                {isAuthenticated && user && (
                  <div className="px-4 py-4 text-sm font-medium text-purple-700 border-b border-purple-200 mb-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-purple-800">
                          Welcome back!
                        </div>
                        <div className="text-purple-600">{user.name}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Links */}
                <div className="space-y-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setOpen(false)}
                      className={`block text-lg font-semibold transition-all duration-300 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 hover:text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-300 ${
                        location.pathname === link.to
                          ? "bg-gradient-to-r from-purple-200 to-pink-200 text-purple-800 shadow-sm"
                          : "text-gray-700 hover:text-purple-700"
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>

                {/* Logout button for mobile */}
                {isAuthenticated && (
                  <div className="pt-2 border-t border-purple-200">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left text-lg font-semibold transition-all duration-300 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-red-100 hover:to-pink-100 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 text-gray-700"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </nav>

      {/* Spacer to prevent content from hiding under fixed navbar */}
      <div className="h-16 lg:h-20"></div>

      {/* Custom keyframes for animations */}
      <style>{`
        @keyframes slide-down {
          0% { 
            opacity: 0; 
            transform: translateY(-10px) scale(0.98);
          }
          100% { 
            opacity: 1; 
            transform: translateY(0) scale(1);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.2s cubic-bezier(0.4,0,0.2,1) both;
        }
      `}</style>
    </>
  );
};

export default Navbar;
