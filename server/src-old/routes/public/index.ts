// src/routes/public.routes.ts
import { FastifyPluginAsync } from "fastify";

export const publicRoutes: FastifyPluginAsync = async (fastify) => {
  // Root endpoint
  fastify.get("/", async (request, reply) => {
    console.log("DDDD : Inside Public API");

    return {
      success: true,
      data: "You are using Public API",
    };
  });

  // Mount user routes under /users
  // fastify.register(userRoute, { prefix: "/users" });
};
