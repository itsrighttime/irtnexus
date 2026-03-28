// src/routes/public.routes.ts
import { fastifyUploadAdapter } from "#packages/storage";
import { FastifyPluginAsync } from "fastify";
import { tenantRoutes } from "./tenant";

export const publicRoutes: FastifyPluginAsync = async (fastify) => {
  // Root endpoint
  fastify.get("/", async (request, reply) => {
    console.log("DDDD : Inside Public API");

    return {
      success: true,
      data: "You are using Public API",
    };
  });
  fastify.post("/", async (request, reply) => {
    try {
      return { success: true, data: request.body };
    } catch (err) {
      reply.code(400);
      return { error: (err as Error).message };
    }
  });

  fastify.register(
    async (fastifyInstance) => {
      await tenantRoutes(fastifyInstance);
    },
    { prefix: "/tenants" },
  );
  // Mount user routes under /users
  // fastify.register(userRoute, { prefix: "/users" });
};
