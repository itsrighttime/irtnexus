// swagger/swagger.ts
import { FastifyInstance } from "fastify";
import fastifySwagger from "@fastify/swagger";

export async function registerSwagger(fastify: FastifyInstance) {
  await fastify.register(fastifySwagger, {
    routePrefix: "/docs", // Swagger UI endpoint
    exposeRoute: true,
    swagger: {
      openapi: "3.0.0",
      info: {
        title: "iRtNexus API",
        version: "1.0.0",
        description:
          "Automatically generated Swagger documentation for iRtNexus services",
      },
    },
  });
}

/*

import Fastify from "fastify";
import { registerSwagger } from "./swagger/swagger";

const fastify = Fastify({ logger: true });

async function start() {
  // Register Swagger
  await registerSwagger(fastify);

  // Your routes go here
  fastify.get("/health", async () => ({ status: "ok" }));

  await fastify.listen({ port: 3000 });
  console.log("Server running at http://localhost:3000");
}

start();


*/
