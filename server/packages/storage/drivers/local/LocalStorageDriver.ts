import {
  StorageDriver,
  UploadOptions,
  FileRecord,
  DownloadOptions,
  StreamOptions,
  SignedUrlOptions,
  FileMetadata,
  Readable,
} from "#packages/storage";
import { download } from "./download/download";
import { generateSignedUrl } from "./download/generateSignedUrl";
import { getMetadata } from "./download/getMetadata";
import { stream } from "./download/stream";
import { archive } from "./lifecycle/archive";
import { cleanupExpired } from "./lifecycle/cleanupExpired";
import { deleteFile } from "./lifecycle/delete";
import { purge } from "./lifecycle/purge";
import { restore } from "./lifecycle/restore";
import { softDelete } from "./lifecycle/softDelete";
import { initMultipartUpload } from "./multipart/completeMultipartUpload";
import { uploadChunk } from "./multipart/initMultipartUpload";
import { completeMultipartUpload } from "./multipart/uploadChunk";
import { extractText } from "./processing/extractText";
import { generatePreview } from "./processing/generatePreview";
import { generateThumbnail } from "./processing/generateThumbnail";
import { scanVirus } from "./processing/scanVirus";
import { checkAccess } from "./security/checkAccess";
import { decrypt } from "./security/decrypt";
import { encrypt } from "./security/encypt";
import { setPermissions } from "./security/setPermissions";
import { storeGeneratedFile } from "./upload/storeGeneratedFile";
import { uploadFile } from "./upload/uploadFile";
import { uploadFromUrl } from "./upload/uploadFromUrl";
import { uploadStream } from "./upload/uploadStream";
import { addVersion } from "./versioning/addVersion";
import { getVersions } from "./versioning/getVersions";
import { revertVersion } from "./versioning/revertVersion";

export class LocalStorageDriver implements StorageDriver {
  capabilities = {
    multipart: true,
    versioning: true,
    processing: false,
    encryption: true,
  };

  constructor() {
    this.uploadFile = uploadFile;
    this.uploadStream = uploadStream;
    this.uploadFromUrl = uploadFromUrl;
    this.storeGeneratedFile = storeGeneratedFile;
    this.download = download;
    this.stream = stream;
    this.generateSignedUrl = generateSignedUrl;
    this.getMetadata = getMetadata;
    this.delete = deleteFile;
    this.softDelete = softDelete;
    this.purge = purge;
    this.archive = archive;
    this.restore = restore;
    this.cleanupExpired = cleanupExpired;
    this.initMultipartUpload = initMultipartUpload;
    this.uploadChunk = uploadChunk;
    this.completeMultipartUpload = completeMultipartUpload;
    this.encrypt = encrypt;
    this.decrypt = decrypt;
    this.setPermissions = setPermissions;
    this.checkAccess = checkAccess;
    this.generateThumbnail = generateThumbnail;
    this.generatePreview = generatePreview;
    this.extractText = extractText;
    this.scanVirus = scanVirus;
    this.addVersion = addVersion;
    this.getVersions = getVersions;
    this.revertVersion = revertVersion;
  }

  // ---------------- Upload Methods ----------------
  uploadFile: (
    file: Buffer | File,
    options?: UploadOptions,
  ) => Promise<FileRecord>;
  uploadStream: (
    stream: Readable,
    options?: UploadOptions,
  ) => Promise<FileRecord>;
  uploadFromUrl: (url: string, options?: UploadOptions) => Promise<FileRecord>;
  storeGeneratedFile: (
    buffer: Buffer,
    options?: UploadOptions,
  ) => Promise<FileRecord>;

  // ---------------- Download Methods ----------------
  download: (fileId: string, options?: DownloadOptions) => Promise<Buffer>;
  stream: (fileId: string, options?: StreamOptions) => Readable;
  generateSignedUrl: (
    fileId: string,
    options?: SignedUrlOptions,
  ) => Promise<string>;
  getMetadata: (fileId: string) => Promise<FileMetadata>;

  // ---------------- Lifecycle Methods ----------------
  delete: (fileId: string) => Promise<boolean>;
  softDelete: (fileId: string) => Promise<boolean>;
  purge: (fileId: string) => Promise<boolean>;
  archive: (fileId: string) => Promise<boolean>;
  restore: (fileId: string) => Promise<boolean>;
  cleanupExpired: (options?: { before?: Date }) => Promise<number>;

  // ---------------- Multipart Methods ----------------
  initMultipartUpload: (
    options?: UploadOptions,
  ) => Promise<{ uploadId: string }>;
  uploadChunk: (
    uploadId: string,
    chunk: Buffer,
    chunkIndex: number,
  ) => Promise<{ etag?: string }>;
  completeMultipartUpload: (uploadId: string) => Promise<FileRecord>;

  // ---------------- Security Methods ----------------
  encrypt: (fileId: string) => Promise<boolean>;
  decrypt: (fileId: string) => Promise<Readable>;
  setPermissions: (fileId: string, permissions: string[]) => Promise<void>;
  checkAccess: (
    fileId: string,
    userId: string,
    action: string,
  ) => Promise<boolean>;

  // ---------------- Processing Methods ----------------
  generateThumbnail: (fileId: string) => Promise<Buffer>;
  generatePreview: (fileId: string) => Promise<Buffer>;
  extractText: (fileId: string) => Promise<string>;
  scanVirus: (fileId: string) => Promise<boolean>;

  // ---------------- Versioning Methods ----------------
  addVersion: (
    fileId: string,
    newFile: Buffer,
    options?: UploadOptions,
  ) => Promise<FileRecord>;
  getVersions: (fileId: string) => Promise<FileRecord[]>;
  revertVersion: (fileId: string, versionId: string) => Promise<FileRecord>;
}
