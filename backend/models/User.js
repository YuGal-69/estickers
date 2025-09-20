import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String }, // Optional for Google OAuth users
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    phone: {
      type: String,
      required: function () {
        return !this.googleId; // Phone required only for non-Google users
      },
    },
    googleId: { type: String, unique: true, sparse: true }, // Google OAuth ID
    profilePicture: { type: String }, // Google profile picture
    otp: {
      code: {
        type: String,
      },
      expiresAt: {
        type: Date,
      },
    },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
