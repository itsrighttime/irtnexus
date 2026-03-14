import { FileRecord, UploadOptions } from "./storage.types";

export interface VersioningMethods {
  addVersion(
    fileId: string,
    newFile: Buffer,
    options?: UploadOptions,
  ): Promise<FileRecord>;

  getVersions(fileId: string): Promise<FileRecord[]>;

  revertVersion(fileId: string, versionId: string): Promise<FileRecord>;
}
