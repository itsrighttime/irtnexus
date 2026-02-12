import express from "express";
import http from "http";
import "dotenv/config";
import { securityConfig, sessionConfig } from "#config";
import { publicRoutes, privateRoutes } from "#routes";
import { globalErrorHandler } from "#utils";
import {
  languageMiddleware,
  requestContextMiddleware,
  authMiddleware,
} from "#middlewares";

const app = express();
const server = http.createServer(app);

// SECURITY MIDDLEWARE
app.use(securityConfig());

// Language detection
app.use(languageMiddleware);

// JSON parser
app.use(express.json());

// Session middleware
app.use(sessionConfig());

// Request context for observability
app.use(requestContextMiddleware);

// Public routes
app.use("/v1/public", publicRoutes);

// Private routes
app.use("/v1/private", authMiddleware, privateRoutes);

// Global error handler
app.use(globalErrorHandler);

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
