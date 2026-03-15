export { fastifyUploadAdapter } from "./multer/fastifyUploadAdapter";
export { StorageDriverFactory } from "./drivers/StorageDriverFactory";
export type { StorageDriver } from "./types/storage.js";

export type {
  UploadOptions,
  DownloadOptions,
  StreamOptions,
  SignedUrlOptions,
  FileRecord,
  FileMetadata,
  StorageCapabilities,
  Readable,
} from "./types/storage.types";
