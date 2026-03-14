import { FILE_CATGORIES as FC } from "#packages/storage/types/category.js";
import { FileTypeDefinition } from "./types";

export const FILE_SIGNATURES_BY_CATEGORY: Record<string, FileTypeDefinition[]> =
  {
    // =====================
    // 1 Images
    // =====================
    [FC.image]: [
      {
        category: FC.image,
        extension: "jpg",
        mime: "image/jpeg",
        signatures: [{ bytes: [0xff, 0xd8, 0xff] }],
      },
      {
        category: FC.image,
        extension: "jpeg",
        mime: "image/jpeg",
        signatures: [{ bytes: [0xff, 0xd8, 0xff] }],
      },
      {
        category: FC.image,
        extension: "png",
        mime: "image/png",
        signatures: [
          { bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
        ],
      },
      {
        category: FC.image,
        extension: "gif",
        mime: "image/gif",
        signatures: [{ bytes: [0x47, 0x49, 0x46, 0x38] }],
      },
      {
        category: FC.image,
        extension: "webp",
        mime: "image/webp",
        signatures: [
          { bytes: [0x52, 0x49, 0x46, 0x46] },
          { bytes: [0x57, 0x45, 0x42, 0x50], offset: 8 },
        ],
      },
      {
        category: FC.image,
        extension: "bmp",
        mime: "image/bmp",
        signatures: [{ bytes: [0x42, 0x4d] }],
      },
      {
        category: FC.image,
        extension: "tiff",
        mime: "image/tiff",
        signatures: [
          { bytes: [0x49, 0x49, 0x2a, 0x00] },
          { bytes: [0x4d, 0x4d, 0x00, 0x2a] },
        ],
      },
      {
        category: FC.image,
        extension: "ico",
        mime: "image/x-icon",
        signatures: [{ bytes: [0x00, 0x00, 0x01, 0x00] }],
      },
      // HEIC / AVIF: mostly ISO Base Media File signature
      {
        category: FC.image,
        extension: "heic",
        mime: "image/heic",
        signatures: [{ bytes: [0x66, 0x74, 0x79, 0x70], offset: 4 }],
      },
      {
        category: FC.image,
        extension: "avif",
        mime: "image/avif",
        signatures: [{ bytes: [0x66, 0x74, 0x79, 0x70], offset: 4 }],
      },
      {
        category: FC.image,
        extension: "svg",
        mime: "image/svg+xml",
        signatures: [],
      }, // text-based, no magic number
    ],

    // =====================
    // 2 Video
    // =====================
    [FC.video]: [
      {
        category: FC.video,
        extension: "mp4",
        mime: "video/mp4",
        signatures: [{ bytes: [0x66, 0x74, 0x79, 0x70], offset: 4 }],
      },
      {
        category: FC.video,
        extension: "mov",
        mime: "video/quicktime",
        signatures: [{ bytes: [0x66, 0x74, 0x79, 0x70], offset: 4 }],
      },
      {
        category: FC.video,
        extension: "mkv",
        mime: "video/x-matroska",
        signatures: [{ bytes: [0x1a, 0x45, 0xdf, 0xa3] }],
      },
      {
        category: FC.video,
        extension: "avi",
        mime: "video/x-msvideo",
        signatures: [
          { bytes: [0x52, 0x49, 0x46, 0x46] },
          { bytes: [0x41, 0x56, 0x49, 0x20], offset: 8 },
        ],
      },
      {
        category: FC.video,
        extension: "webm",
        mime: "video/webm",
        signatures: [{ bytes: [0x1a, 0x45, 0xdf, 0xa3] }],
      },
      {
        category: FC.video,
        extension: "m4v",
        mime: "video/x-m4v",
        signatures: [{ bytes: [0x66, 0x74, 0x79, 0x70], offset: 4 }],
      },
      {
        category: FC.video,
        extension: "flv",
        mime: "video/x-flv",
        signatures: [{ bytes: [0x46, 0x4c, 0x56, 0x01] }],
      },
      {
        category: FC.video,
        extension: "wmv",
        mime: "video/x-ms-wmv",
        signatures: [
          { bytes: [0x30, 0x26, 0xb2, 0x75, 0x8e, 0x66, 0xcf, 0x11] },
        ],
      },
      {
        category: FC.video,
        extension: "3gp",
        mime: "video/3gpp",
        signatures: [{ bytes: [0x66, 0x74, 0x79, 0x70], offset: 4 }],
      },
      {
        category: FC.video,
        extension: "mpeg",
        mime: "video/mpeg",
        signatures: [{ bytes: [0x00, 0x00, 0x01, 0xba] }],
      },
      {
        category: FC.video,
        extension: "mpg",
        mime: "video/mpeg",
        signatures: [{ bytes: [0x00, 0x00, 0x01, 0xba] }],
      },
    ],

    // =====================
    // 3 Audio
    // =====================
    [FC.audio]: [
      {
        category: FC.audio,
        extension: "mp3",
        mime: "audio/mpeg",
        signatures: [{ bytes: [0x49, 0x44, 0x33] }],
      },
      {
        category: FC.audio,
        extension: "wav",
        mime: "audio/wav",
        signatures: [
          { bytes: [0x52, 0x49, 0x46, 0x46] },
          { bytes: [0x57, 0x41, 0x56, 0x45], offset: 8 },
        ],
      },
      {
        category: FC.audio,
        extension: "flac",
        mime: "audio/flac",
        signatures: [{ bytes: [0x66, 0x4c, 0x61, 0x43] }],
      },
      {
        category: FC.audio,
        extension: "ogg",
        mime: "audio/ogg",
        signatures: [{ bytes: [0x4f, 0x67, 0x67, 0x53] }],
      },
      {
        category: FC.audio,
        extension: "aac",
        mime: "audio/aac",
        signatures: [],
      },
      {
        category: FC.audio,
        extension: "m4a",
        mime: "audio/mp4",
        signatures: [{ bytes: [0x66, 0x74, 0x79, 0x70], offset: 4 }],
      },
      {
        category: FC.audio,
        extension: "amr",
        mime: "audio/amr",
        signatures: [{ bytes: [0x23, 0x21, 0x41, 0x4d, 0x52] }],
      },
      {
        category: FC.audio,
        extension: "aiff",
        mime: "audio/aiff",
        signatures: [{ bytes: [0x46, 0x4f, 0x52, 0x4d] }],
      },
      {
        category: FC.audio,
        extension: "opus",
        mime: "audio/opus",
        signatures: [{ bytes: [0x4f, 0x70, 0x75, 0x73], offset: 0 }],
      },
      {
        category: FC.audio,
        extension: "wma",
        mime: "audio/x-ms-wma",
        signatures: [],
      },
    ],

    // =====================
    // 4 Document
    // =====================
    [FC.document]: [
      {
        category: FC.document,
        extension: "pdf",
        mime: "application/pdf",
        signatures: [{ bytes: [0x25, 0x50, 0x44, 0x46] }],
      },
      {
        category: FC.document,
        extension: "txt",
        mime: "text/plain",
        signatures: [],
      },
      {
        category: FC.document,
        extension: "rtf",
        mime: "application/rtf",
        signatures: [{ bytes: [0x7b, 0x5c, 0x72, 0x74, 0x66] }],
      },
      {
        category: FC.document,
        extension: "md",
        mime: "text/markdown",
        signatures: [],
      },
      {
        category: FC.document,
        extension: "log",
        mime: "text/plain",
        signatures: [],
      },
    ],

    // =====================
    // 5 Office
    // =====================
    [FC.office]: [
      {
        category: FC.office,
        extension: "doc",
        mime: "application/msword",
        signatures: [{ bytes: [0xd0, 0xcf, 0x11, 0xe0] }],
      },
      {
        category: FC.office,
        extension: "docx",
        mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        signatures: [{ bytes: [0x50, 0x4b, 0x03, 0x04] }],
      },
      {
        category: FC.office,
        extension: "xls",
        mime: "application/vnd.ms-excel",
        signatures: [{ bytes: [0xd0, 0xcf, 0x11, 0xe0] }],
      },
      {
        category: FC.office,
        extension: "xlsx",
        mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        signatures: [{ bytes: [0x50, 0x4b, 0x03, 0x04] }],
      },
      {
        category: FC.office,
        extension: "ppt",
        mime: "application/vnd.ms-powerpoint",
        signatures: [{ bytes: [0xd0, 0xcf, 0x11, 0xe0] }],
      },
      {
        category: FC.office,
        extension: "pptx",
        mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        signatures: [{ bytes: [0x50, 0x4b, 0x03, 0x04] }],
      },
      {
        category: FC.office,
        extension: "odt",
        mime: "application/vnd.oasis.opendocument.text",
        signatures: [{ bytes: [0x50, 0x4b, 0x03, 0x04] }],
      },
      {
        category: FC.office,
        extension: "ods",
        mime: "application/vnd.oasis.opendocument.spreadsheet",
        signatures: [{ bytes: [0x50, 0x4b, 0x03, 0x04] }],
      },
      {
        category: FC.office,
        extension: "odp",
        mime: "application/vnd.oasis.opendocument.presentation",
        signatures: [{ bytes: [0x50, 0x4b, 0x03, 0x04] }],
      },
    ],

    // =====================
    // 6 Code / Text-Based (no reliable magic numbers)
    // =====================
    [FC.code]: [
      {
        category: FC.code,
        extension: "json",
        mime: "application/json",
        signatures: [],
      },
      {
        category: FC.code,
        extension: "yaml",
        mime: "application/x-yaml",
        signatures: [],
      },
      {
        category: FC.code,
        extension: "yml",
        mime: "application/x-yaml",
        signatures: [],
      },
      {
        category: FC.code,
        extension: "xml",
        mime: "application/xml",
        signatures: [],
      },
      {
        category: FC.code,
        extension: "toml",
        mime: "application/toml",
        signatures: [],
      },
      {
        category: FC.code,
        extension: "ini",
        mime: "text/plain",
        signatures: [],
      },
      {
        category: FC.code,
        extension: "env",
        mime: "text/plain",
        signatures: [],
      },
      {
        category: FC.code,
        extension: "js",
        mime: "application/javascript",
        signatures: [],
      },
      {
        category: FC.code,
        extension: "ts",
        mime: "application/typescript",
        signatures: [],
      },
      {
        category: FC.code,
        extension: "py",
        mime: "text/x-python",
        signatures: [],
      },
    ],

    // =====================
    // 7 Archive
    // =====================
    [FC.archive]: [
      {
        category: FC.archive,
        extension: "zip",
        mime: "application/zip",
        signatures: [{ bytes: [0x50, 0x4b, 0x03, 0x04] }],
      },
      {
        category: FC.archive,
        extension: "rar",
        mime: "application/vnd.rar",
        signatures: [{ bytes: [0x52, 0x61, 0x72, 0x21] }],
      },
      {
        category: FC.archive,
        extension: "7z",
        mime: "application/x-7z-compressed",
        signatures: [{ bytes: [0x37, 0x7a, 0xbc, 0xaf, 0x27, 0x1c] }],
      },
      {
        category: FC.archive,
        extension: "tar",
        mime: "application/x-tar",
        signatures: [],
      },
      {
        category: FC.archive,
        extension: "gz",
        mime: "application/gzip",
        signatures: [{ bytes: [0x1f, 0x8b, 0x08] }],
      },
      {
        category: FC.archive,
        extension: "tgz",
        mime: "application/gzip",
        signatures: [{ bytes: [0x1f, 0x8b, 0x08] }],
      },
      {
        category: FC.archive,
        extension: "bz2",
        mime: "application/x-bzip2",
        signatures: [{ bytes: [0x42, 0x5a, 0x68] }],
      },
      {
        category: FC.archive,
        extension: "xz",
        mime: "application/x-xz",
        signatures: [{ bytes: [0xfd, 0x37, 0x7a, 0x58, 0x5a, 0x00] }],
      },
    ],

    // =====================
    // 8 Dataset
    // =====================
    [FC.dataset]: [
      {
        category: FC.dataset,
        extension: "csv",
        mime: "text/csv",
        signatures: [],
      },
      {
        category: FC.dataset,
        extension: "tsv",
        mime: "text/tab-separated-values",
        signatures: [],
      },
      {
        category: FC.dataset,
        extension: "parquet",
        mime: "application/parquet",
        signatures: [],
      },
      {
        category: FC.dataset,
        extension: "avro",
        mime: "application/avro",
        signatures: [],
      },
      {
        category: FC.dataset,
        extension: "sqlite",
        mime: "application/x-sqlite3",
        signatures: [],
      },
      {
        category: FC.dataset,
        extension: "db",
        mime: "application/x-sqlite3",
        signatures: [],
      },
    ],

    // =====================
    // 9 Font
    // =====================
    [FC.font]: [
      {
        category: FC.font,
        extension: "ttf",
        mime: "font/ttf",
        signatures: [{ bytes: [0x00, 0x01, 0x00, 0x00] }],
      },
      {
        category: FC.font,
        extension: "otf",
        mime: "font/otf",
        signatures: [{ bytes: [0x4f, 0x54, 0x54, 0x4f] }],
      },
      {
        category: FC.font,
        extension: "woff",
        mime: "font/woff",
        signatures: [{ bytes: [0x77, 0x4f, 0x46, 0x46] }],
      },
      {
        category: FC.font,
        extension: "woff2",
        mime: "font/woff2",
        signatures: [{ bytes: [0x77, 0x4f, 0x46, 0x32] }],
      },
      {
        category: FC.font,
        extension: "eot",
        mime: "application/vnd.ms-fontobject",
        signatures: [{ bytes: [0x00, 0x00, 0x01, 0x00] }],
      },
    ],
  };
