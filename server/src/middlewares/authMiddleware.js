// src/middlewares/authMiddleware.js
import { redis } from "#config";
import { logger, REDIS_PREFIX } from "#utils";

export const authMiddleware = async (req, res, next) => {
  try {
    // 1. Check if session exists
    const sessionId = req.sessionID;
    if (!sessionId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No session found" });
    }

    // 2. Verify session in Redis
    const sessionData = await redis.get(`${REDIS_PREFIX.SESSION}${sessionId}`);
    if (!sessionData) {
      return res.status(401).json({ message: "Unauthorized: Invalid session" });
    }

    // 3. Parse session data (Redis stores it as JSON string)
    const sessionObj = JSON.parse(sessionData);

    // 4. Attach user info to req for downstream handlers
    req.user = sessionObj.user || null;

    // 5. Optional: check if user is active, role validation, etc.
    if (!req.user || !req.user.isActive) {
      return res.status(403).json({ message: "Forbidden: User inactive" });
    }

    next(); // Allow request to continue
  } catch (err) {
    logger.error("Auth Middleware Error:");
    logger.error(err);
    res
      .status(500)
      .json({ message: "Internal Server Error in authentication" });
  }
};
