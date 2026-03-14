import {
  DownloadOptions,
  FileMetadata,
  Readable,
  SignedUrlOptions,
  StreamOptions,
} from "./storage.types";

export interface DownloadMethods {
  download(fileId: string, options?: DownloadOptions): Promise<Buffer>;

  stream(fileId: string, options?: StreamOptions): Readable;

  generateSignedUrl(
    fileId: string,
    options?: SignedUrlOptions,
  ): Promise<string>;

  getMetadata(fileId: string): Promise<FileMetadata>;
}
