// src/routes/private.routes.ts
import { authPlugin } from "#middlewares";
import { FastifyPluginAsync } from "fastify";

/**
 * Private API routes
 */
export const privateRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("preHandler", authPlugin);

  fastify.get("/", async (request, reply) => {
    console.log("DDDD : Inside Private API");

    return {
      success: true,
      data: "You are using Private API",
    };
  });
};
