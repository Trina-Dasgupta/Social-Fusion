import Redis from "ioredis";
import { verifyToken } from "./verifyJwt.js";



const redisClient = new Redis(); // Connect to Redis

export const addToBlacklist = async (token) => {
  const decoded = verifyToken(token);
  if (!decoded) return;

  const expirationTime = decoded.exp - Math.floor(Date.now() / 1000); // Calculate token expiry
  if (expirationTime > 0) {
    await redisClient.setex(`blacklist:${token}`, expirationTime, "true"); // Store in Redis
  }
};

export const isBlacklisted = async (token) => {
  const result = await redisClient.get(`blacklist:${token}`);
  return result === "true"; // Return true if token is blacklisted
};
