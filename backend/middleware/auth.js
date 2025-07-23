// middleware/auth.js

import jwt from "jsonwebtoken";
import User from "../models/User.js"; 
import dotenv from "dotenv";

dotenv.config();

// export const verifyToken = async (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ message: "No token provided" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // contains user id and role
//     next();
//   } catch (err) {
//     return res.status(403).json({ message: "Invalid or expired token" });
//   }
// };

// export const verifyAdmin = async (req, res, next) => {
//   if (!req.user || req.user.role !== "admin") {
//     return res.status(403).json({ message: "Admin access only" });
//   }
//   next();
// };
// verifyToken middleware
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // contains { id, isAdmin, ... }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// verifyAdmin middleware
export const verifyAdmin = (req, res, next) => {
  if (req.user?.isAdmin) {
    return next();
  }
  return res.status(403).json({ message: "Admin access only" });
};
