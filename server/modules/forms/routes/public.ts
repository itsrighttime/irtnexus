import { FastifyInstance } from "fastify";
import { ccPartnershipConfig, ccPartnershipForm } from "../controllers";

export async function formsPublicRoutes(fastify: FastifyInstance) {
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
