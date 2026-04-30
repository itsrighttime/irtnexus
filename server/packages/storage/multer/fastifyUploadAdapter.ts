import { FastifyRequest } from "fastify";
import { FileRecord, StorageDriverFactory } from "#packages/storage";
import { UploadOptions } from "#packages/storage";
import { logger } from "#utils";

export async function fastifyUploadAdapter(
  request: FastifyRequest,
  options?: UploadOptions,
) {
  logger.debug("[fastifyUploadAdapter] Starting upload adapter");

  const driver = StorageDriverFactory.createDriver();

  const files: FileRecord[] = [];
  let fields: Record<string, any> = {};

  // CASE 1: NON-MULTIPART (JSON)
  if (!request.isMultipart()) {
    logger.debug("[fastifyUploadAdapter] Handling JSON request");

    fields = request.body as Record<string, any>;

    return { files, fields };
  }

  // CASE 2: MULTIPART
  logger.debug("[fastifyUploadAdapter] Handling multipart request");

  const parts = request.parts();

  for await (const part of parts) {
    logger.debug(`[fastifyUploadAdapter] Processing part: type=${part.type}`);

    if (part.type === "file") {
      const buffer = await part.toBuffer();

      const record: FileRecord = await driver.uploadFile(buffer, {
        ...options,
        filename: part.filename,
        mimeType: part.mimetype,
      });

      files.push(record);
    } else if (part.type === "field") {
      const { fieldname, value } = part;

      //  Auto-parse structured JSON
      if (fieldname === "data") {
        try {
          fields = JSON.parse(value as any);
        } catch {
          logger.warn("[fastifyUploadAdapter] Invalid JSON in 'data'");
          fields = {};
        }
      } else {
        fields[fieldname] = value;
      }
    }
  }

  logger.debug(`[fastifyUploadAdapter] Completed. files=${files.length}`);

  return { files, fields };
}
