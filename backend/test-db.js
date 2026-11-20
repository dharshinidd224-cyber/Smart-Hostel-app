
const { sequelize, pool } = require("./src/config/db");

async function testConnection() {
  try {
    console.log("Testing Sequelize connection...");

    await sequelize.authenticate();
    console.log("SUCCESS: Sequelize connected to TiDB!");

    console.log("\nTesting MySQL2 connection...");

    const [rows] = await pool.query("SELECT VERSION() AS version");

    console.log("SUCCESS: MySQL2 connected to TiDB!");
    console.log("Database version:", rows[0].version);

  } catch (error) {
    console.error("DATABASE CONNECTION FAILED:");
    console.error(error.message);
  } finally {
    await sequelize.close();
    await pool.end();
  }
}

testConnection();
