// tenant.route.ts

import { repoAccount } from "#modules/identity/index.js";
import { RegisterTenantInput, TenantService } from "#modules/tenant/";
import { response } from "#packages/utils/index.js";
import { SYSTEM_DEFAULT } from "#tools/const/systemDefault.js";
import { normalizeRegisterTenant } from "../../pre-validations";
import { registerTenantSchema } from "../../schema/";
import { FastifyInstance, FastifyRequest } from "fastify";

export async function tenantRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/register",
    {
      schema: registerTenantSchema,
      preValidation: normalizeRegisterTenant,
    },
    async (request: FastifyRequest<{ Body: RegisterTenantInput }>, reply) => {
      const body = request.body;

      const account = await repoAccount.findOne(
        { username: SYSTEM_DEFAULT.ACCOUNT_USERNAME },
        {
          userId: null,
          tenantId: null,
        },
      );

      // No tenant/user yet → system context
      const ctx = {
        userId: account?.account_id || null,
        tenantId: null,
      };

      const result = await TenantService.register(body, ctx);

      if (!result.success) {
        return response.error(
          request,
          reply,
          result.errors || {},
          result.message,
          "ABDXS",
        );
      }

      return response.success(
        request,
        reply,
        result.data,
        "Tenant Created Successfully.",
        "ABDXS",
      );
    },
  );
}
