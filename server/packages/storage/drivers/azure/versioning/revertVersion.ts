import { FileRecord } from "#packages/storage";

export const revertVersion = async function (
  fileId: string,
  versionId: string,
): Promise<FileRecord> {
  console.log("revertVersion called with", { fileId, versionId });
  throw new Error("Need to Implement revertVersion");
};
