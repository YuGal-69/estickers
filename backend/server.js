import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import path from "path";

import connetDB from "./config/db.js";
import stickerRoutes from "./routes/stickerRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const PORT = process.env.PORT || 3000;

const app = express();

// middleware
app.use(express.json());
app.use(cors());

// db connection
connetDB();

// routes
app.use("/api/stickers", stickerRoutes);
app.use("/api/auth", authRoutes);
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// to solve render shutdown problem
app.get("/api/ping", (req, res) => {
  res.status(200).send("pong");
});

// run server
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
