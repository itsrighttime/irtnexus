import { fastifyUploadAdapter } from "#packages/storage/index.js";
import { response } from "#packages/utils/index.js";
import { FastifyInstance, FastifyRequest } from "fastify";

export async function formsRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/partnership",
    {
      // schema: registerTenantSchema,
      // preValidation: normalizeRegisterTenant,
    },
    async (request: FastifyRequest, reply) => {
      const body = request.body;
      const uploadOptions = {
        folder: "forms/partnership",
        metadata: { uploadedBy: "Unknown" },
      };

      const { files, fields } = await fastifyUploadAdapter(
        request,
        uploadOptions,
      );

      console.log("DDDD : ", { body, fields, files });

      return response.success(
        request,
        reply,
        [],
        "Tenant Created Successfully.",
        "ABDXS",
      );
    },
  );
}
