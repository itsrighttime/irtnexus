import { IncomingMessage } from "http";
import { uploadFile } from "#packages/storage/drivers/local/upload/uploadFile";
import { UploadOptions } from "#packages/storage";
import { Buffer } from "buffer";

/**
 * Parses a multipart/form-data HTTP request and uploads files.
 *
 * @param req Node.js IncomingMessage (HTTP request)
 * @param globalOptions Optional global UploadOptions
 */
export async function handleMultipartUpload(
  req: IncomingMessage,
  globalOptions?: UploadOptions,
) {
  return new Promise<{ files: any[]; fields: Record<string, any> }>(
    (resolve, reject) => {
      const contentType = req.headers["content-type"];
      if (!contentType || !contentType.startsWith("multipart/form-data")) {
        return reject(new Error("Content-Type must be multipart/form-data"));
      }

      // Extract boundary
      const boundaryMatch = contentType.match(/boundary=(.+)$/);
      if (!boundaryMatch) return reject(new Error("Boundary not found"));
      const boundary = `--${boundaryMatch[1]}`;

      const chunks: Buffer[] = [];
      req.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
      req.on("end", async () => {
        const buffer = Buffer.concat(chunks);
        const parts = buffer
          .toString("binary")
          .split(boundary)
          .filter((part) => part && part !== "--\r\n");

        const files: any[] = [];
        const fields: Record<string, any> = {};

        for (const part of parts) {
          // Separate headers from body
          const [rawHeaders, ...bodyParts] = part.split("\r\n\r\n");
          if (!rawHeaders || bodyParts.length === 0) continue;

          const body = Buffer.from(bodyParts.join("\r\n\r\n"), "binary");
          const headersLines = rawHeaders
            .split("\r\n")
            .map((line) => line.trim())
            .filter(Boolean);

          const headers: Record<string, string> = {};
          headersLines.forEach((line) => {
            const [key, ...rest] = line.split(":");
            headers[key.toLowerCase()] = rest.join(":").trim();
          });

          // Parse Content-Disposition
          const disposition = headers["content-disposition"];
          if (!disposition) continue;

          const nameMatch = disposition.match(/name="(.+?)"/);
          const filenameMatch = disposition.match(/filename="(.+?)"/);

          const fieldName = nameMatch?.[1];
          const fileName = filenameMatch?.[1];

          if (fileName) {
            // This is a file part
            try {
              const uploaded = await uploadFile(body, {
                ...globalOptions,
                filename: fileName,
              });
              files.push(uploaded);
            } catch (err) {
              return reject(err);
            }
          } else if (fieldName) {
            // This is a regular form field
            fields[fieldName] = body.toString("utf-8").trim();
          }
        }

        resolve({ files, fields });
      });

      req.on("error", (err) => reject(err));
    },
  );
}
