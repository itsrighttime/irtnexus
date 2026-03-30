import { FastifyRequest, FastifyReply } from "fastify";
import { AsyncLocalStorage } from "async_hooks";
import { ActorContext, RequestContext } from "#types";
// import { observability } from "#core";
import { HEADERS } from "#configs";
import { generateUUID, logger } from "#utils";

// AsyncLocalStorage store type
const asyncLocalStorage = new AsyncLocalStorage<Map<string, any>>();

/**
 * Retrieve current request context anywhere downstream
 */
export const getRequestFullContext = (): RequestContext | null => {
  const store = asyncLocalStorage.getStore();
  return store?.get("context") || null;
};

const getEndpoint = (request: FastifyRequest): string => {
  // Fastify adds 'routerPath' internally for matched routes, but TS doesn't know it
  // We can cast to 'any' safely
  const routerPath = (request as any).routerPath as string | undefined;
  return routerPath || request.raw.url || "unknown";
};

/**
 * Fastify plugin to attach request context
 */
export const requestContextPlugin = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const startTime = Date.now();

  const traceHeaderRaw = request.headers?.[HEADERS.TRACEPARENT.toLowerCase()];
  const traceHeader = Array.isArray(traceHeaderRaw)
    ? traceHeaderRaw[0]
    : traceHeaderRaw;

  const context: RequestContext = {
    requestId: request.id ? request.id : generateUUID(),
    traceId: traceHeader ?? generateUUID(),
    auditId: null, // Initialized as null; can be set later

    actor: {
      anonymous: true,
      userId: null,
      username: null,
      role: null,
      tenantId: null,
      tenantIdentifier: null,
    } as ActorContext,
    startTime,
  };

  // Initialize async local store for this request
  asyncLocalStorage.run(new Map(), () => {
    asyncLocalStorage.getStore()?.set("context", context);

    // Verbose logging for debugging
    logger.verbose("[Request Context] Initialized:", context);

    // // Notify observability layer
    // observability.prometheus?.startRequest();

    // // Attach finish hook
    // reply.raw.on("finish", () => {
    //   const durationMs = Date.now() - startTime;

    //   // Ignore metrics for certain endpoints
    //   const ignoredPaths = ["/metrics", "/health", "/internal"];
    //   const endpoint = getEndpoint(request);

    //   if (!ignoredPaths.includes(endpoint)) {
    //     observability.prometheus?.endRequest({
    //       method: request.method,
    //       endpoint,
    //       statusCode: reply.statusCode,
    //       durationMs,
    //     });

    //     observability.logRequest({
    //       req: request,
    //       res: reply,
    //       durationMs,
    //       error: (reply as any).locals?.error,
    //     });
    //   }
    // });
  });
};
