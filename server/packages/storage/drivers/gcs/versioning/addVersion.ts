import { FileRecord, UploadOptions } from "#packages/storage";

export const addVersion = async function (
  fileId: string,
  newFile: Buffer,
  options?: UploadOptions,
): Promise<FileRecord> {
  console.log("addVersion called with", { fileId, options });
  throw new Error("Need to Implement addVersion");
};
