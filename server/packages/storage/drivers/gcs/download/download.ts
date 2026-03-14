import { DownloadOptions } from "#packages/storage/types/storage.types.js";

export const download = async function (
  fileId: string,
  options?: DownloadOptions,
): Promise<Buffer> {
  console.log("download called with", { fileId, options });
  throw new Error("Need to Implement download");
};
