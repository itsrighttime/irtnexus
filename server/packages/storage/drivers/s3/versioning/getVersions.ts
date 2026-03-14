import { FileRecord } from "#packages/storage";

export const getVersions = async function (
  fileId: string,
): Promise<FileRecord[]> {
  console.log("getVersions called with", { fileId });
  throw new Error("Need to Implement getVersions");
};
