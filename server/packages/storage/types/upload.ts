import { FileRecord, Readable, UploadOptions } from "./storage.types";

export interface UploadMethods {
  uploadFile(file: Buffer | Blob): Promise<FileRecord>;

  uploadStream(stream: Readable, options?: UploadOptions): Promise<FileRecord>;

  uploadFromUrl(url: string, options?: UploadOptions): Promise<FileRecord>;

  storeGeneratedFile(
    buffer: Buffer,
    options?: UploadOptions,
  ): Promise<FileRecord>;
}
