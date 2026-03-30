import { FastifyRequest } from "fastify";
import { DB_RequestContext } from "../database";
import { getRequestFullContext } from "#apps/rest-server";

export const getReqContext = (req: FastifyRequest): DB_RequestContext => {
  const reqCon = getRequestFullContext();
  if (reqCon) {
    return {
      tenantId: reqCon.actor.tenantId || "",
      accountId: reqCon.actor.accountId || "",
    };
  } else
    return {
      tenantId: "",
      accountId: "",
    };
};
