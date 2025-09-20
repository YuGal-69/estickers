import express from "express";
import {
  signup,
  login,
  verifyOtp,
  resendOtp,
  loginWithPassword,
  googleLogin,
} from "../controllers/authController.js";

const router = express.Router();

// OTP-based authentication (original)
router.post("/signup", signup);
router.post("/login", login);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);

// Alternative authentication methods
router.post("/login-password", loginWithPassword);
router.post("/google-login", googleLogin);

export default router;
