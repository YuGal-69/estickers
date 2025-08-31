import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await login(email);
      setSuccess(res.message || "OTP sent to your email.");

      // ✅ Redirect to OTP page
      setTimeout(() => {
        navigate("/otp", {
          state: { email, fromLogin: true },
        });
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 via-yellow-100 to-blue-100 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-xl shadow-lg w-full max-w-sm sm:max-w-md lg:max-w-lg">
        {/* Logo and Brand */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 rounded-xl shadow-lg flex items-center justify-center">
              <span className="text-white text-sm sm:text-lg font-bold">C</span>
            </div>
            <span className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600">
              Creatistick
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-pink-600">
            Welcome Back
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mt-2">
            Sign in to your account to continue
          </p>
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm sm:text-base">
            <div className="flex items-center gap-2">
              <span className="text-red-500">⚠️</span>
              {error}
            </div>
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 sm:p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm sm:text-base">
            <div className="flex items-center gap-2">
              <span className="text-green-500">✅</span>
              {success}
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 sm:py-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-yellow-500 text-white py-3 sm:py-3.5 rounded-lg font-semibold hover:from-pink-600 hover:to-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Sending OTP...
              </div>
            ) : (
              "Send OTP"
            )}
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-gray-600 text-sm sm:text-base">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-pink-600 font-semibold hover:text-pink-700 transition-colors duration-200 underline decoration-2 underline-offset-2"
            >
              Sign up here
            </Link>
          </p>
        </div>

        {/* Additional Info */}
        <div className="mt-6 sm:mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs sm:text-sm text-gray-500 text-center">
            We'll send a one-time password to your email for secure login
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
