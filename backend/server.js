
require("dotenv").config();

const { sequelize } = require("./src/models");
const app = require("./src/app");

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Step 1: Verify database connection
    await sequelize.authenticate();

    console.log("SUCCESS: Connected to TiDB Cloud");

    // Step 2: Create missing tables
    await sequelize.sync();

    console.log("SUCCESS: Database tables synchronized");

    // Step 3: Start backend
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Backend running on port ${PORT}`);
      console.log(`Local: http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("Backend startup failed:");
    console.error(error);
    process.exit(1);
  }
}

startServer();
