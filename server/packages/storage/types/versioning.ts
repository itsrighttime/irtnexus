import { FileRecord, Readable, UploadOptions } from "./storage.types";

export interface VersioningMethods {
  addVersion(
    fileId: string,
    newFile: Buffer | Readable,
    options?: UploadOptions,
  ): Promise<FileRecord>;

  getVersions(fileId: string): Promise<FileRecord[]>;

  revertVersion(fileId: string, versionId: string): Promise<FileRecord>;
}
