import { generateUUID } from "#packages/utils";

export function buildStorageKey(options: any) {
  const id = generateUUID();

  const module = options.module || "general";
  const entity = options.entityType || "file";

  return `${module}/${entity}/${id}`;
}
