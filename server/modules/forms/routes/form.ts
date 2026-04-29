import { fastifyUploadAdapter } from "#packages/storage/index.js";
import { response } from "#packages/utils/index.js";
import { FastifyInstance, FastifyRequest } from "fastify";
import { ccPartnershipConfig, ccPartnershipForm } from "../controllers";

export async function formsRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/partnership",
    {
      // schema: registerTenantSchema,
      // preValidation: normalizeRegisterTenant,
    },
    ccPartnershipForm,
  );
  fastify.get(
    "/partnership-config/:key",
    {
      // schema: registerTenantSchema,
      // preValidation: normalizeRegisterTenant,
    },
    ccPartnershipConfig,
  );
}
