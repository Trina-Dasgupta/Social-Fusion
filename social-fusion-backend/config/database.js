import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Create Sequelize instance
const db = new Sequelize(
  process.env.DB_NAME || "socialfusion",
  process.env.DB_USER || "root",
  process.env.DB_PASS || "admin#123",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    logging: false,
  }
);

export default db;
