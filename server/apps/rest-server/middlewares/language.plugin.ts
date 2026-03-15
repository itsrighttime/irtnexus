import { FastifyRequest, FastifyReply, FastifyPluginAsync } from "fastify";
import { HEADERS } from "#configs";
import { AsyncLocalStorage } from "async_hooks";
import { LanguageQuery } from "#types";

const asyncLocalStorage = new AsyncLocalStorage<Map<string, any>>();

export const languagePlugin = async (
  request: FastifyRequest<{ Querystring: LanguageQuery }>,
  reply: FastifyReply,
) => {
  asyncLocalStorage.run(new Map<string, any>(), () => {
    const store = asyncLocalStorage.getStore();
    if (!store) return;

    // header -> query param -> fallback
    const lang =
      (request.headers?.[HEADERS.LANGUAGE.toLowerCase()] as string) ||
      request.query.lang ||
      "en";

    store.set(HEADERS.LANGUAGE, lang);
  });
};
export const getLanguageContext = (): string | null => {
  const store = asyncLocalStorage.getStore();
  if (!store) return null;

  return store.get(HEADERS.LANGUAGE) ?? null;
};
