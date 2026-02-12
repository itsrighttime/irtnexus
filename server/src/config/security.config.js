// src/middlewares/securityMiddleware.js
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import csrf from "csurf";
import { configCors } from "#config";

/**
 * Security Middleware
 *
 * Applies all security-related middlewares in one place.
 * - Helmet for headers & CSP
 * - Rate Limiting
 * - CORS
 * - CSRF protection
 */
export const securityConfig = () => {
  return [
    // 1. HTTP Headers Security
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:"],
          fontSrc: ["'self'", "data:"],
          connectSrc: ["'self'"],
        },
      },
      crossOriginEmbedderPolicy: false,
    }),

    // 2. Rate Limiting (15 min window, 100 requests per IP)
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100,
      standardHeaders: true,
      legacyHeaders: false,
    }),

    // 3. CORS configuration
    configCors,

    // 4. CSRF Protection
    csrf({ cookie: true }),
  ];
};
