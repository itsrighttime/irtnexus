import { DB_RequestContext } from "#packages/database";
import "fastify";
import { RequestContext } from "./auth";

declare module "fastify" {
  interface FastifyRequest {
    ctx: DB_RequestContext;
    context: RequestContext;
  }
}
