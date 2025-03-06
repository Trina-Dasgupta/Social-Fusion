
import { isBlacklisted } from "../utils/tokenBlacklist.js";
import { verifyToken } from "../utils/verifyJwt.js";


export const authenticate = async (req, res, next) => {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (await isBlacklisted(token)) {
    return res.status(403).json({ error: "Token has been revoked. Please log in again." });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded; 
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
