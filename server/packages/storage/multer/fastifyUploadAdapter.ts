import { FastifyRequest } from "fastify";
import { StorageDriverFactory } from "#packages/storage";
import { UploadOptions } from "#packages/storage";
import { logger } from "#utils";

export async function fastifyUploadAdapter(
  request: FastifyRequest,
  options?: UploadOptions,
) {
  logger.debug("[fastifyUploadAdapter] Starting upload adapter");

  const driver = StorageDriverFactory.createDriver();
  logger.debug("[fastifyUploadAdapter] Storage driver initialized");

  const files = [];
  const fields: Record<string, any> = {};

  const parts = request.parts();
  logger.debug("[fastifyUploadAdapter] Beginning to process multipart parts");

  for await (const part of parts) {
    logger.debug(`[fastifyUploadAdapter] Processing part: type=${part.type}`);

    if (part.type === "file") {
      logger.debug(
        `[fastifyUploadAdapter] Reading file part: filename=${part.filename}, mimetype=${part.mimetype}`,
      );

      const buffer = await part.toBuffer();
      logger.debug(
        `[fastifyUploadAdapter] File converted to buffer, size=${buffer.length} bytes`,
      );

      const record = await driver.uploadFile(buffer, {
        ...options,
        filename: part.filename,
        mimeType: part.mimetype,
      });
      logger.debug(`[fastifyUploadAdapter] File uploaded: `, record);

      files.push(record);
    } else if (part.type === "field") {
      logger.debug(
        `[fastifyUploadAdapter] Reading field part: fieldname=${part.fieldname}, value=${part.value}`,
      );
      fields[part.fieldname] = part.value;
    } else {
      logger.debug(`[fastifyUploadAdapter] Unknown part type: ${part}`);
    }
  }

  logger.debug(
    `[fastifyUploadAdapter] Upload adapter finished, total files uploaded=${files.length}`,
  );

  return { files, fields };
}
