import fs from "fs/promises";
import path from "path";
import { FileRecord, UploadOptions } from "#packages/storage";
import { generateUUID } from "#packages/utils";
import {
  detectFileType,
  sanitizeFileName,
  STORAGE_ROOT,
} from "#packages/storage/utils";
import { logger } from "#utils";

export async function uploadFile(
  file: Buffer | File,
  options?: UploadOptions,
): Promise<FileRecord> {
  try {
    logger.info("[uploadFile] Starting file upload", {
      filename: options?.filename,
    });

    // Convert to Buffer (Node.js only, fallback for File-like)
    const buffer: Buffer =
      file instanceof Buffer
        ? file
        : "arrayBuffer" in file
          ? Buffer.from(await file.arrayBuffer())
          : Buffer.from(file as any);

    logger.debug("[uploadFile] Converted file to buffer", {
      size: buffer.length,
    });

    // Detect file type using magic bytes
    const type = detectFileType(buffer);

    if (!type) {
      throw new Error("Unsupported file type");
    }

    const extension = type.extension.toLowerCase();
    const mimeType = type.mime;
    const category = type.category;

    logger.debug("[uploadFile] Detected file type", {
      extension,
      mimeType,
      category,
    });

    // --- Validate against options ---
    if (options?.category) {
      const allowedCategories = Array.isArray(options.category)
        ? options.category
        : [options.category];

      if (!allowedCategories.includes(category)) {
        throw new Error(
          `Category '${category}' is not allowed. Allowed: [${allowedCategories.join(", ")}]`,
        );
      }
    }

    if (options?.mimeType) {
      const allowedMimes = Array.isArray(options.mimeType)
        ? options.mimeType
        : [options.mimeType];

      if (!allowedMimes.includes(mimeType)) {
        throw new Error(
          `MIME type '${mimeType}' is not allowed. Allowed: [${allowedMimes.join(", ")}]`,
        );
      }
    }

    // --- Sanitize filename ---
    const originalName = sanitizeFileName(
      options?.filename || `file.${extension}`,
    );

    logger.debug("[uploadFile] Sanitized file name", { originalName });

    const id = generateUUID();
    const fileName = `${id}.${extension}`;

    // --- Determine storage directory ---
    const folderPath = options?.folder
      ? path.join(STORAGE_ROOT, category, options.folder)
      : path.join(STORAGE_ROOT, category);

    await fs.mkdir(folderPath, { recursive: true });
    logger.info("[uploadFile] Created storage directory", { folderPath });

    const filePath = path.join(folderPath, fileName);

    // --- Write file ---
    await fs.writeFile(filePath, buffer);
    const stats = await fs.stat(filePath);

    logger.debug("[uploadFile] File written to disk", {
      filePath,
      size: stats.size,
    });

    // --- Return FileRecord with metadata ---
    const record: FileRecord = {
      id,
      filename: originalName,
      extension,
      category,
      mimeType,
      size: stats.size,
      path: filePath,
      createdAt: new Date(),
      metadata: options?.metadata || {},
      public: options?.public || false,
    };

    logger.info("[uploadFile] File upload completed", { fileRecord: record });

    return record;
  } catch (error: any) {
    logger.error("[uploadFile] File upload failed", error);
    throw error; // rethrow after logging
  }
}
