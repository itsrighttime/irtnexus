import express from "express";
import http from "http";
import "dotenv/config";
import { registerSecurity, registerSession } from "#config";
import { publicRoutes, privateRoutes } from "#routes";
import { globalErrorHandler } from "#utils";
import {
  languageMiddleware,
  requestContextMiddleware,
  authMiddleware,
} from "#middlewares";
import { prometheusRegistry } from "#core";

const app = express();
const server = http.createServer(app);

// Language detection
app.use(languageMiddleware);

// JSON parser
app.use(express.json());

// Session middleware
app.use(registerSession());

// SECURITY MIDDLEWARE
app.use(registerSecurity());

// Request context for observability
app.use(requestContextMiddleware);

app.get("/metrics", async (_req, res) => {
  res.set("Content-Type", prometheusRegistry.contentType);
  res.end(await prometheusRegistry.metrics());
});

// Public routes
app.use("/v1/public", publicRoutes);

// Private routes
app.use("/v1/private", authMiddleware, privateRoutes);

// Global error handler
app.use(globalErrorHandler);

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
