
require("dotenv").config();

const { sequelize } = require("./src/models");
const app = require("./src/app");

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    console.log("\n======================================");
    console.log("   HOSTEL MANAGEMENT SYSTEM");
    console.log("======================================");

    // Step 1: Check environment
    console.log("\n[1] Checking environment...");

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET missing in .env");
    }

    console.log("SUCCESS: Environment variables loaded");

    // Step 2: Connect to TiDB Cloud
    console.log("\n[2] Connecting to TiDB Cloud...");

    await sequelize.authenticate();

    console.log("SUCCESS: Connected to TiDB Cloud");
    console.log("Database:", process.env.DB_NAME);

    // Step 3: Synchronize database
    console.log("\n[3] Synchronizing database tables...");

    await sequelize.sync();

    console.log("SUCCESS: Database tables synchronized");

    // Step 4: Start backend
    app.listen(PORT, "0.0.0.0", () => {
      console.log("\n======================================");
      console.log("   BACKEND SERVER STARTED");
      console.log("======================================");
      console.log(`Backend: http://localhost:${PORT}`);
      console.log("TiDB Cloud: CONNECTED");
      console.log("Database: READY");
      console.log("Login API: /api/auth/login");
      console.log("Waiting for login requests...");
      console.log("======================================\n");
    });

  } catch (error) {
    console.error("\nBACKEND STARTUP FAILED:");
    console.error(error.message);
    process.exit(1);
  }
}

startServer();
