
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

// Register all models and associations before loading routes
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
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://192.168.106.191:3000",
    "http://10.62.62.163:3000"
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`\n${req.method} ${req.path}`);
  console.log("Client IP:", req.ip);
  next();
});

app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://192.168.99.25:3000",
    "http://192.168.99.25:3001",
    "http://192.168.106.191:3000",
    "http://10.62.62.163:3000"
  ],
  credentials: true
}));

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
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("ERROR:", err.stack);

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

