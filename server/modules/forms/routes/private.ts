import { FastifyInstance, FastifyRequest } from "fastify";
import { ccPartnershipConfig, ccPartnershipForm } from "../controllers";

export async function formsPrivateRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/partnership", 
    {
      // schema: registerTenantSchema,
      // preValidation: normalizeRegisterTenant,
    },
    ccPartnershipForm,
  );
}
