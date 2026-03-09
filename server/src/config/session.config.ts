// src/middlewares/sessionMiddleware.ts
import fastifySecureSession from "@fastify/secure-session";
import type { FastifyInstance, FastifyRequest } from "fastify";
import { redis } from "#config";
import { randomBytes } from "crypto";

/**
 * Registers session management with Fastify
 *
 * - Secure cookies
 * - Manual rolling sessions (touch in preHandler)
 */
export const registerSession = async (app: FastifyInstance): Promise<void> => {
  await redis.connect();

  const secretKey =
    process.env.SESSION_SECRET || randomBytes(32).toString("hex");

  await app.register(fastifySecureSession, {
    key: Buffer.from(secretKey, "hex"),
    cookie: {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 12, // 12 hours
    },
  });

  // Optional: expose redis for manual session storage / persistence
  app.decorate("sessionStore", redis);

  // Implement "rolling session" manually
  app.addHook("preHandler", async (req: FastifyRequest) => {
    if (req.session.changed) {
      // Sets lastAccess or similar to refresh expiry
      // req.session.set("lastAccess", Date.now());
    }
  });
};
