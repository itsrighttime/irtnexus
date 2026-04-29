import { fastifyUploadAdapter } from "#packages/storage";
import { response } from "#packages/utils";
import { FastifyRequest, FastifyReply } from "fastify";
import { ssPartnershipForm } from "../services";

export const ccPartnershipForm = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const uploadOptions = {
    folder: "forms/partnership",
    metadata: { uploadedBy: "Unknown" },
  };

  const { files, fields } = await fastifyUploadAdapter(request, uploadOptions);

  ssPartnershipForm(fields, files);

  return response.success(
    request,
    reply,
    [],
    "Tenant Created Successfully.",
    "ABDXS",
  );
};
