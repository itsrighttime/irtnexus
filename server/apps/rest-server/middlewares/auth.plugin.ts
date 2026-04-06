// src/middlewares/auth.plugin.ts
import { FastifyReply, FastifyRequest } from "fastify";
import { HEADERS, JWT_CONFIG, redis, REDIS_PREFIX } from "#configs";
import { logger } from "#utils";
import { RequestContext, SessionData } from "#types";
import jwt from "jsonwebtoken";

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
    const authHeader = request.headers[HEADERS.AUTHORIZATION];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      reply.status(401).send({ message: "Unauthorized" });
      return;
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, JWT_CONFIG.SECRET) as any;

    // Attach to context instead of request.user
    if (request.context) {
      request.context.actor = {
        anonymous: false,
        accountId: decoded.id,
        username: decoded.username,
        role: decoded.role,
        tenantId: decoded.tenantId ?? null,
        tenantIdentifier: decoded.tenantIdentifier ?? null,
      };
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
