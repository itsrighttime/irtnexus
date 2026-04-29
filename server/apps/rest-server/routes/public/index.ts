import { FastifyPluginAsync } from "fastify";
import { tenantRoutes } from "./tenant";
import { PUBLIC_ROUTES } from "#modules";

export const publicRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.register(
    async (fastifyInstance) => {
      await tenantRoutes(fastifyInstance);
    },
    { prefix: "/tenants" },
  );

  fastify.register(
    async (fastifyInstance) => {
      await PUBLIC_ROUTES.forms(fastifyInstance);
    },
    { prefix: "/forms" },
  );
  // Mount user routes under /users
  // fastify.register(userRoute, { prefix: "/users" });
};
