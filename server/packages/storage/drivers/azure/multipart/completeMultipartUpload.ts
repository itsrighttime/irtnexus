import { UploadOptions } from "#packages/storage";

export const initMultipartUpload = async function (
  options?: UploadOptions,
): Promise<{ uploadId: string }> {
  console.log("initMultipartUpload called with", { options });
  throw new Error("Need to Implement initMultipartUpload");
};
