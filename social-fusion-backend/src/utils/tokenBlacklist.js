import { verifyToken } from "./verifyJwt.js";
import createRedisClient from "./redis.js";



const redisClient = createRedisClient();// Connect to Redis

export const addToBlacklist = async (token) => {
  const decoded = verifyToken(token);
  if (!decoded) return;

  const expirationTime = Math.max(decoded.exp - Math.floor(Date.now() / 1000), 0);
  
  // if (expirationTime > 0) {
  //   await redisClient.setex(`blacklist:${token}`, expirationTime, 'true');
  // }
};

export const isBlacklisted = async (token) => {
  const result = await redisClient.get(`blacklist:${token}`);
  return result === 'true'; // Return true if token is blacklisted
};
// const tokenBlacklist = new Set(); // ✅ In-memory store

// export const addToBlacklist = (token, exp) => {
//   if (exp > Math.floor(Date.now() / 1000)) {
//     tokenBlacklist.add(token);

//     // ✅ Auto-remove after expiration time
//     setTimeout(() => tokenBlacklist.delete(token), (exp - Math.floor(Date.now() / 1000)) * 1000);
//   }
// };

// export const isBlacklisted = (token) => {
//   return tokenBlacklist.has(token);
// };
