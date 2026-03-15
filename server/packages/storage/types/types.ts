import { FILE_CATGORIES as FC } from "#packages/storage/types/category.js";

export type FileCategory =
  | typeof FC.image
  | typeof FC.video
  | typeof FC.audio
  | typeof FC.document
  | typeof FC.office
  | typeof FC.code
  | typeof FC.archive
  | typeof FC.dataset
  | typeof FC.font;

export interface FileTypeDefinition {
  category: FileCategory
  extension: string;
  mime: string;
  signatures?: Signature[];
}

export interface Signature {
  bytes: number[];
  offset?: number;
}

export interface DetectedFileType {
  category: FileCategory;
  extension: string;
  mime: string;
}

export interface DetectionOptions {
  expectedCategory?: FileCategory;
  expectedExtension?: string;
  expectedMime?: string;
}
