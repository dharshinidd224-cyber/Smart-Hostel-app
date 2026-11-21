
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

// Register models and associations before routes
require("./models");

const authRoutes = require("./routes/auth.routes");
const attendanceRoutes = require("./routes/attendance");
const grievanceRoutes = require("./routes/grievanceRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const adminRoutes = require("./routes/admin.routes");
const studentRoutes = require("./routes/student.routes");
const noticesRoutes = require("./routes/noticeRoutes");

const app = express();

app.set("trust proxy", true);

app.use(helmet());

app.use(cors({
  origin: [
    // Vite dev server (current)
    "http://localhost:4028",
    "http://127.0.0.1:4028",
    // CRA / fallback dev ports
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    // Previous LAN IPs (kept for other team members)
    "http://192.168.106.191:3000",
    "http://10.62.62.163:3000",
    "http://10.135.49.123:4028"
  ],
  credentials: true
}));

app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));

// Log every incoming request
app.use((req, res, next) => {
  console.log("\n========== INCOMING REQUEST ==========");
  console.log("Method:", req.method);
  console.log("URL:", req.originalUrl);
  console.log("Client IP:", req.ip);

  if (req.originalUrl.includes("/auth/login")) {
    console.log("LOGIN ENDPOINT REQUEST RECEIVED");
  }

  console.log("======================================");
  next();
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/grievances", grievanceRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/notices", noticesRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    ip: req.ip
  });
});

// IP detection test
app.get("/api/test-ip", (req, res) => {
  const forwarded = req.headers["x-forwarded-for"];
  const socketIp = req.socket.remoteAddress;

  const finalIP = (
    forwarded ? forwarded.split(",")[0].trim() : socketIp
  ).replace("::ffff:", "");

  res.json({
    message: "IP Detection Test",
    finalIP
  });
});

// 404 handler
app.use((req, res) => {
  console.log("❌ ROUTE NOT FOUND:", req.method, req.originalUrl);

  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("❌ SERVER ERROR:", err.stack);

  res.status(500).json({
    success: false,
    message: "Internal server error",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong"
  });
});

module.exports = app;
