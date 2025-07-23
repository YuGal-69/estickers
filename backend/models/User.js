import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    phone: {
      type: String,
      required: true,
    },
    otp: {
      code: {
        type: String,
      },
      expiresAt: {
        type: Date,
      },
    },
    isVerified: { type: Boolean, default: false }, // ⬅️ recommended default
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
