// middleware/auth.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

/**
 * ✅ Authentication Middleware
 * - Checks if a valid JWT token is provided in the Authorization header
 * - Decodes token and attaches `req.user`
 */
export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "Invalid token format" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token expired. Please login again." });
    }
    return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
  }
};


/**
 * ✅ Admin Middleware
 * - Ensures that only users with `admin` role can access the route
 */
export const adminMiddleware = (req, res, next) => {
  console.log("🔍 Checking admin role for user:", req.user);

  if (!req.user) {
    console.warn("🚫 No user found on request. Did you forget authMiddleware?");
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  if (req.user.role !== "admin") {
    console.warn(`🚫 Access denied. User role is '${req.user.role}'`);
    return res.status(403).json({ success: false, message: "Admin access only" });
  }

  console.log("✅ Admin access granted");
  next();
};
