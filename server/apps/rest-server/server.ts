import Fastify, { FastifyInstance } from "fastify";
import multipart from "@fastify/multipart";
import "dotenv/config";
import { registerSecurity, registerSession } from "#configs";
import { publicRoutes, privateRoutes } from "#apps/rest-server/routes";
import { generateUUID, globalErrorHandler, logger } from "#utils";
import {
  languagePlugin,
  requestContextPlugin,
  authPlugin,
} from "#apps/rest-server/middlewares";
import { observability, prometheusRegistry } from "#packages/monitoring";
import { testDB } from "#packages/database";

export const createServer = async (): Promise<FastifyInstance> => {
  // const app = Fastify({logger: true});
  const app = Fastify();

  // ----------------------------
  // Core Plugins / Middleware
  // ----------------------------
  app.register(registerSession); // Must be a FastifyPluginAsync
  app.register(registerSecurity); // Must be a FastifyPluginAsync
  app.addHook("preHandler", languagePlugin);
  app.addHook("preHandler", requestContextPlugin);

  // Register Multer
  app.register(multipart, {
    attachFieldsToBody: false, // optional, allows access to text fields
    limits: {
      fileSize: 100 * 1024 * 1024, // 100 MB max per file
      files: 10, // max 10 files per request
    },
  });

  // ----------------------------
  // Metrics / Observability
  // ----------------------------
  app.addHook("onRequest", async (req, _reply) => {
    // Store request start time in the request object
    (req as any).startTime = Date.now();
    (req as any).context = {
      // TODO : Extract this from tocken
      actor: {
        tenantId: req.headers["x-tenant-id"] as string | undefined,
        userId: req.headers["x-user-id"] as string | undefined,
        userRole: req.headers["x-user-role"] as string | undefined,
      },
      requestId: (req.headers["x-request-id"] as string) || generateUUID(),
      traceId: (req.headers["x-trace-id"] as string) || generateUUID(),
    };
  });

  app.addHook("onResponse", async (req, reply) => {
    const durationMs = Date.now() - ((req as any).startTime || Date.now());
    const error =
      reply.statusCode >= 400 ? new Error("Request failed") : undefined;

    observability.logRequest({ req, res: reply, durationMs, error });
  });

  app.get("/metrics", async (_req, reply) => {
    try {
      reply.header("Content-Type", prometheusRegistry.contentType);
      reply.send(await prometheusRegistry.metrics());
    } catch (err) {
      reply.status(500).send(err);
    }
  });

  // ----------------------------
  // Public Routes
  // ----------------------------
  app.register(publicRoutes, { prefix: "/v1/public" });

  // ----------------------------
  // Private Routes with Auth
  // ----------------------------
  app.register(privateRoutes, { prefix: "/v1/private" });

  // ----------------------------
  // Global Error Handler
  // ----------------------------
  app.setErrorHandler(globalErrorHandler);

  return app;
};

// ----------------------------
// Server bootstrap
// ----------------------------
const PORT = Number(process.env.PORT) || 5001;

// Test Databse is Connected successfully or not
testDB();

createServer()
  .then((app) => app.listen({ port: PORT, host: "0.0.0.0" }))
  .then(() => logger.info(`Server running on port ${PORT}`))
  .catch((err) => {
    logger.error("Error starting server:", err);
    process.exit(1);
  });
