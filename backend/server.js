import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import path from "path";

import connetDB from "./config/db.js";
import stickerRoutes from "./routes/stickerRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

const PORT = process.env.PORT || 3000;

const app = express();

// middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// db connection
connetDB(); // Temporarily commented out for testing

// routes
app.use("/api/stickers", stickerRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// to solve render shutdown problem
app.get("/api/ping", (req, res) => {
  res.status(200).send("pong");
});

// run server
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
