// src/config/cors.ts
import { FastifyInstance } from "fastify";
import fastifyCors from "@fastify/cors";

/**
 * List of allowed origins for CORS
 * Only requests coming from these origins will be accepted.
 */
const allowedOrigins = [
  "http://localhost:1060",
  "http://localhost:1061",
  "http://localhost:5173",
  "http://localhost:1062",
];

/**
 * Registers CORS with Fastify
 * @param app FastifyInstance
 */
export async function registerCors(app: FastifyInstance) {
  await app.register(fastifyCors, {
    origin: (origin, cb) => {
      // Requests without Origin (Postman, mobile apps, etc.)
      if (!origin) return cb(null, true);

      // Allow only if in allowedOrigins
      if (allowedOrigins.includes(origin)) {
        return cb(null, true);
      } else {
        return cb(
          new Error(`CORS policy does not allow access from ${origin}`),
          false,
        );
      }
    },
    credentials: true,
  });
}
