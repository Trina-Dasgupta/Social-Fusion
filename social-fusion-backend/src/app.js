import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { config } from "dotenv";
import authRoutes from "./routes/authRoutes.js"; // Fixed import
import "../src/jobs/cronJobs.js";
config(); // Load environment variables

const app = express();

// Middleware setup
app.use(
    cors({
      origin: "*", 
      credentials: true, 
    })
  );
app.use(helmet());
app.use(morgan("dev"));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

// Health check route
app.get("/api/health", (_, res) => res.status(200).json({ status: "running" }));

// Routes
app.use("/api/auth", authRoutes);

export default app;
