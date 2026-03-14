import { FileRecord, Readable, UploadOptions } from "#packages/storage";

export const uploadStream = async function (
  stream: Readable,
  options?: UploadOptions,
): Promise<FileRecord> {
  console.log("uploadStream called with", { stream, options });
  throw new Error("Need to Implement uploadStream");
};
