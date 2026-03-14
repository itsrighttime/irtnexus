import { FileMetadata } from "#packages/storage";

export const getMetadata = async function (
  fileId: string,
): Promise<FileMetadata> {
  console.log("getMetadata called with", { fileId });
  throw new Error("Need to Implement getMetadata");
};
