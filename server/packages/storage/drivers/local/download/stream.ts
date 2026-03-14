import { Readable, StreamOptions } from "#packages/storage";

export const stream = function (
  fileId: string,
  options?: StreamOptions,
): Readable {
  console.log("stream called with", { fileId, options });
  throw new Error("Need to Implement stream");
};
