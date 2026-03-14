export type { Readable } from "stream";

export interface UploadOptions {
  filename?: string;
  mimeType?: string[] | string;
  category?: string[] | string;
  folder?: string;
  metadata?: Record<string, any>;
  public?: boolean;
}

export interface DownloadOptions {
  versionId?: string;
}

export interface StreamOptions {
  start?: number;
  end?: number;
}

export interface SignedUrlOptions {
  expiresIn?: number;
  action?: "read" | "write";
}

export interface FileRecord {
  id: string;
  filename: string;
  extension: string;
  category: string;
  mimeType: string;
  path: string;
  size: number;
  url?: string;
  createdAt: Date;
  metadata?: Record<string, any>;
  public?: boolean;
}

export interface FileMetadata {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  createdAt: Date;
  metadata?: Record<string, any>;
}

export interface StorageCapabilities {
  multipart?: boolean;
  versioning?: boolean;
  processing?: boolean;
  encryption?: boolean;
}

export type StorageDriverType = "s3" | "local" | "gcs" | "azure";
