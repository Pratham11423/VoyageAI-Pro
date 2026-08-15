const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const { apiLimiter } = require("./middleware/security");

const authRoutes = require("./routes/auth.routes");
const tripRoutes = require("./routes/trip.routes");
const apiRoutes = require("./routes/api.routes");

const app = express();

app.use("/api", apiLimiter);

// Security Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false, // Allow local avatar access in frontend dev
}));
app.use(cors({
  origin: true,
  credentials: true,
}));

// Body Parser Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging Middleware
app.use(morgan("dev"));

// Serve static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api", apiRoutes); // AI and Maps routing

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date() });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error Handler Catch:", err.stack);
  res.status(err.status || 500).json({
    error: err.message || "An unexpected server error occurred.",
  });
});

module.exports = app;
