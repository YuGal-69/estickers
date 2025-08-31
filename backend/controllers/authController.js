import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { registerSchema } from "../validators/authValidation.js";
import { generateOtp } from "../utils/generateOTP.js";
import { sendOtpEmail } from "../utils/sendEmail.js";

// ✅ Centralized admin email list
const ADMIN_EMAILS = ["yugalhemane2@gmail.com"];

// ✅ JWT helper
const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};

// ✳️ Signup Controller
export const signup = async (req, res) => {
  try {
    const validated = registerSchema.parse(req.body);
    const { name, email, password, phone } = validated;

    let user = await User.findOne({ email });

    if (user && user.isVerified) {
      return res
        .status(409)
        .json({ success: false, message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otpCode = generateOtp();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    const role = ADMIN_EMAILS.includes(email) ? "admin" : "user";

    await User.updateOne(
      { email },
      {
        $set: {
          name,
          email,
          password: hashedPassword,
          role,
          phone,
          isVerified: false,
          otp: { code: otpCode, expiresAt: otpExpires },
        },
      },
      { upsert: true }
    );

    await sendOtpEmail(email, otpCode);

    return res.status(200).json({
      success: true,
      message: "OTP sent to your email for verification",
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(400).json({ success: false, message: err.message });
  }
};

// ✳️ OTP Verification Controller
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and OTP",
      });
    }

    const user = await User.findOne({ email });

    if (
      !user ||
      !user.otp ||
      String(user.otp.code) !== String(otp) ||
      new Date() > user.otp.expiresAt
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = {};
    await user.save();

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role, // ✅ Always include role
      },
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ✳️ Login Controller
export const login = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user || !user.isVerified) {
      return res.status(404).json({
        success: false,
        message: "User not found or not verified. Please sign up first.",
      });
    }

    const otpCode = generateOtp();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = {
      code: otpCode,
      expiresAt: otpExpires,
    };

    await user.save();

    await sendOtpEmail(email, otpCode);

    return res.status(200).json({
      success: true,
      message: "OTP sent to your email",
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const otpCode = generateOtp();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = { code: otpCode, expiresAt: otpExpires };
    await user.save();

    await sendOtpEmail(email, otpCode);

    return res.status(200).json({ success: true, message: "OTP resent to your email" });
  } catch (err) {
    console.error("Resend OTP error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

