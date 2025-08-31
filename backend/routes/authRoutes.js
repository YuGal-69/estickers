import express from "express";
import {
  signup,
  login,
  verifyOtp,
  resendOtp,

} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
// router.post("/login-otp", loginWithOtp); // OTP-based login

export default router;
