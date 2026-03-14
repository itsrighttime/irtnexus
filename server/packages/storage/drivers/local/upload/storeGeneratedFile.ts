import { FileRecord, UploadOptions } from "#packages/storage";

export const storeGeneratedFile = async function (
  buffer: Buffer,
  options?: UploadOptions,
): Promise<FileRecord> {
  console.log("storeGeneratedFile called with", { buffer, options });
  throw new Error("Need to Implement storeGeneratedFile");
};
