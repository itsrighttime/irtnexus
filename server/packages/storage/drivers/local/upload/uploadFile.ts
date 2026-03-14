import { FileRecord, UploadOptions } from "#packages/storage";

export const uploadFile = async function (
  file: Buffer | File,
  options?: UploadOptions,
): Promise<FileRecord> {
  console.log("uploadFile called with", { file, options });
  throw new Error("Need to Implement uploadFile");
};
