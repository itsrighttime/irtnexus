import { SignedUrlOptions } from "#packages/storage";
export const generateSignedUrl = async function (
  fileId: string,
  options?: SignedUrlOptions,
): Promise<string> {
  console.log("generateSignedUrl called with", { fileId, options });
  throw new Error("Need to Implement generateSignedUrl");
};
