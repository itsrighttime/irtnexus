import Fastify, { FastifyInstance } from "fastify";
import "dotenv/config";
import { registerSecurity, registerSession } from "#configs";
import { publicRoutes, privateRoutes } from "#apps/rest-server/routes";
import { globalErrorHandler, logger } from "#utils";
import {
  languagePlugin,
  requestContextPlugin,
  authPlugin,
} from "#apps/rest-server/middlewares";
// import { metricsPlugin } from "#core/metrics";

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

  // ----------------------------
  // Metrics / Observability
  // ----------------------------
  // app.register(metricsPlugin, { prefix: "/metrics" });

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

createServer()
  .then((app) => app.listen({ port: PORT, host: "0.0.0.0" }))
  .then(() => logger.info(`Server running on port ${PORT}`))
  .catch((err) => {
    logger.error("Error starting server:", err);
    process.exit(1);
  });
