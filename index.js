import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import shopRoutes from "./routes/shopRoutes.js";
import cors from "cors"; // Add CORS support
import morgan from "morgan"; // HTTP request logger

const app = express();
dotenv.config();

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const PORT = process.env.PORT || 8000;
const MONGOURL = process.env.MONGOURL;

mongoose.connect(MONGOURL)
  .then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err.message);
    process.exit(1);
  });

// Routes
app.use("/api/shops", shopRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is healthy" });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});
