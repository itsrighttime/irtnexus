import { response } from "#packages/utils";
import { FastifyRequest, FastifyReply } from "fastify";
import { ssPartnershipConfig } from "../services";
import { TypeFormMapKey } from "../const";

export const ccPartnershipConfig = async (
  request: FastifyRequest<{ Params: { key: TypeFormMapKey } }>,
  reply: FastifyReply,
) => {
  const config = await ssPartnershipConfig(request.params.key);

  return response.success(
    request,
    reply,
    config,
    "Tenant Created Successfully.",
    "ABDXS",
  );
};
