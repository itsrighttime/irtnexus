// src/types/fastify-swagger.d.ts
declare module "@fastify/swagger" {
  import { FastifyPluginCallback } from "fastify";
  const fastifySwagger: FastifyPluginCallback<any>;
  export default fastifySwagger;
}
