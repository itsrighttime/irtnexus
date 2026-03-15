// src/middlewares/auth.plugin.ts
import { FastifyReply, FastifyRequest } from "fastify";
import { redis, REDIS_PREFIX } from "#configs";
import { logger } from "#utils";
import { SessionData } from "#types";

/**
 * Auth plugin for Fastify
 *
 * Usage:
 * app.register(authPlugin, { prefix: '/v1/private' });
 */
export const authPlugin = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    // 1. Get session ID from request (cookies or headers)
    const sessionId =
      (request.cookies?.sessionId as string) ||
      (request.headers?.["x-session-id"] as string);

    if (!sessionId) {
      reply.status(401).send({ message: "Unauthorized: No session found" });
      return;
    }

    // 2. Verify session exists in Redis
    const sessionDataStr = await redis.get(
      `${REDIS_PREFIX.SESSION}${sessionId}`,
    );
    if (!sessionDataStr) {
      reply.status(401).send({ message: "Unauthorized: Invalid session" });
      return;
    }

    // 3. Parse session data
    const sessionObj: SessionData = JSON.parse(sessionDataStr);

    // 4. Attach user info to request
    (request as any).user = sessionObj.user;

    // 5. Optional: user active check
    if (!sessionObj.user || !sessionObj.user.isActive) {
      reply.status(403).send({ message: "Forbidden: User inactive" });
      return;
    }

    // Allow request to continue
    return;
  } catch (err: unknown) {
    logger.error("Auth Plugin Error:");
    logger.error(err instanceof Error ? err : String(err));
    reply
      .status(500)
      .send({ message: "Internal Server Error in authentication" });
  }
};
