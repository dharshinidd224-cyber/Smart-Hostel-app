
const { Sequelize } = require("sequelize");
const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

// Load backend/.env
require("dotenv").config({
  path: path.resolve(__dirname, "../../.env")
});

// Load TiDB CA certificate
const caPath = path.join(__dirname, "../certs/ca.pem");
const ca = fs.readFileSync(caPath);

const dbOptions = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 4000),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: {
    ca,
    rejectUnauthorized: true
  }
};

// Sequelize connection
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 4000),
    dialect: "mysql",
    dialectOptions: {
      ssl: {
        ca,
        rejectUnauthorized: true
      }
    },
    logging: false,
    define: {
      freezeTableName: true
    }
  }
);

// mysql2 connection pool
const pool = mysql.createPool({
  ...dbOptions,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = {
  sequelize,
  pool
};
