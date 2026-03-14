import { FileRecord, UploadOptions } from "./storage.types";

export interface MultipartUploadMethods {
  initMultipartUpload(options?: UploadOptions): Promise<{ uploadId: string }>;

  uploadChunk(
    uploadId: string,
    chunk: Buffer,
    chunkIndex: number,
  ): Promise<{ etag?: string }>;

  completeMultipartUpload(
    uploadId: string,
    parts: { index: number; etag?: string }[],
  ): Promise<FileRecord>;
}
