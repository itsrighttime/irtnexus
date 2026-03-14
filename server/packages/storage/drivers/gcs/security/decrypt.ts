import { Readable } from "#packages/storage";

export const decrypt = async function (fileId: string): Promise<Readable> {
  console.log("decrypt called with", { fileId });
  throw new Error("Need to Implement decrypt");
};
