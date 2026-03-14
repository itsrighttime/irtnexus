import { FileRecord } from "#packages/storage";

export const completeMultipartUpload = async function (
  uploadId: string,
): Promise<FileRecord> {
  console.log("completeMultipartUpload called with", { uploadId });
  throw new Error("Need to Implement completeMultipartUpload");
};
