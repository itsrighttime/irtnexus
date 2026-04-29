// src/middlewares/securityMiddleware.ts
import fastifyHelmet from "@fastify/helmet";
import fastifyRateLimit from "@fastify/rate-limit";
import { registerCors } from "#configs";
import { FastifyInstance } from "fastify";
import { allowedOrigins } from "./cors.config";

/**
 * Apply all security-related middlewares to Fastify
 *
 * Includes:
 * 1. Helmet headers
 * 2. Rate limiting
 * 3. CORS
 */
export const registerSecurity = async (app: FastifyInstance) => {
  // 1️⃣ HTTP Headers Security (Helmet)
  await app.register(fastifyHelmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        fontSrc: ["'self'", "data:"],
        connectSrc: ["'self'", ...allowedOrigins],
      },
    },
    crossOriginEmbedderPolicy: false,
  });

  // 2️⃣ Rate Limiting
  await app.register(fastifyRateLimit, {
    max: 100, // max 100 requests
    timeWindow: "15 minutes", // per 15 min
    allowList: [], // optionally allow trusted IPs
    keyGenerator: (req) => req.ip, // limit per IP
    errorResponseBuilder: (req, context) => {
      return {
        statusCode: 429,
        error: "Too Many Requests",
        message: `Rate limit exceeded, retry in ${context.ttl}ms`,
      };
    },
  });
};
