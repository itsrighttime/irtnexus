export const uploadChunk = async function (
  uploadId: string,
  chunk: Buffer,
  chunkIndex: number,
): Promise<{ etag?: string }> {
  console.log("uploadChunk called with", { uploadId, chunkIndex });
  throw new Error("Need to Implement uploadChunk");
};
