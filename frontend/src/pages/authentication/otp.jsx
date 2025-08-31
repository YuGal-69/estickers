// src/pages/auth/OTP.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { authService, apiPost } from "../../services/api";

const OTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOtp: verifyOtpFromCtx } = useAuth() || {};
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const email = location.state?.email;
  const fromLogin = location.state?.fromLogin;
  const fromSignup = location.state?.fromSignup;

  useEffect(() => {
    if (!email) {
      navigate("/login");
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Please enter a 6-digit OTP");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // prefer context if provided, else call service directly
      const res = await (verifyOtpFromCtx
        ? verifyOtpFromCtx(email, otp)
        : authService.verifyOtp(email, otp));

      if (!res?.success) {
        throw new Error(res?.message || "OTP verification failed");
      }

      setSuccess(res.message || "OTP verified successfully!");

      // You already store token/user in api.js on success,
      // so we can safely redirect.
      setTimeout(() => {
        navigate("/dashboard");
      }, 800);
    } catch (err) {
      setError(err.message || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email) return;

    setCanResend(false);
    setTimeLeft(60);
    setError("");
    setSuccess("");

    try {
      if (fromLogin) {
        // Your backend's /api/auth/login sends a new OTP for verified users
        const r = await authService.login(email);
        if (!r?.success) throw new Error(r?.message || "Failed to resend OTP");
        setSuccess(r.message || "OTP resent successfully! Check your email.");
      } else if (fromSignup) {
        // For sign-up flow, call a dedicated resend endpoint (step 3 below)
        const r = await apiPost("/api/auth/resend-otp", { email });
        if (!r?.success) throw new Error(r?.message || "Failed to resend OTP");
        setSuccess(r.message || "OTP resent successfully! Check your email.");
      } else {
        setSuccess("OTP resent.");
      }
    } catch (err) {
      setError(err.message || "Failed to resend OTP. Please try again.");
      setCanResend(true);
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
  };

  if (!email) return null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 via-yellow-100 to-blue-100 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-xl shadow-lg w-full max-w-sm sm:max-w-md lg:max-w-lg">
        {/* Header */}
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
            Verify OTP
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mt-2">
            {fromSignup ? "Complete your registration" : "Sign in to your account"}
          </p>
        </div>

        {/* Email */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm sm:text-base text-blue-700 text-center">
            <span className="font-medium">OTP sent to:</span>
            <br />
            <span className="font-semibold">{email}</span>
          </p>
        </div>

        {/* Alerts */}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
              Enter 6-digit OTP
            </label>
            <input
              type="text"
              id="otp"
              name="otp"
              placeholder="000000"
              value={otp}
              onChange={handleOtpChange}
              className="w-full px-4 py-3 sm:py-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-center text-lg sm:text-xl font-mono tracking-widest"
              maxLength={6}
              required
            />
            <p className="text-xs text-gray-500 mt-1 text-center">
              Enter the 6-digit code sent to your email
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full bg-gradient-to-r from-pink-500 to-yellow-500 text-white py-3 sm:py-3.5 rounded-lg font-semibold hover:from-pink-600 hover:to-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Verifying...
              </div>
            ) : (
              "Verify OTP"
            )}
          </button>
        </form>

        {/* Resend */}
        <div className="mt-6 sm:mt-8 text-center">
          {canResend ? (
            <button
              onClick={handleResendOTP}
              className="text-pink-600 font-semibold hover:text-pink-700 transition-colors duration-200 underline decoration-2 underline-offset-2 text-sm sm:text-base"
            >
              Resend OTP
            </button>
          ) : (
            <p className="text-gray-500 text-sm sm:text-base">
              Resend OTP in{" "}
              <span className="font-mono font-semibold text-pink-600">
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
              </span>
            </p>
          )}
        </div>

        {/* Back link */}
        <div className="mt-6 sm:mt-8 text-center">
          <button
            onClick={() => navigate("/login")}
            className="text-gray-600 hover:text-gray-800 transition-colors duration-200 text-sm sm:text-base underline decoration-1 underline-offset-2"
          >
            ← Back to Login
          </button>
        </div>

        <div className="mt-6 sm:mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs sm:text-sm text-gray-500 text-center">
            Check your email inbox and spam folder for the OTP code
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTP;
