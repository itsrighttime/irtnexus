import { FileRecord, UploadOptions } from "#packages/storage";

export const uploadFromUrl = async function (
  url: string,
  options?: UploadOptions,
): Promise<FileRecord> {
  console.log("uploadFromUrl called with", { url, options });
  throw new Error("Need to Implement uploadFromUrl");
};
