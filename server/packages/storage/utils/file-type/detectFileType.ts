import { FILE_SIGNATURES_BY_CATEGORY } from "./fileSignature";
import { matchSignature } from "./matchSignature";
import { DetectedFileType, DetectionOptions, FileCategory } from "./types";

export function detectFileType(
  buffer: Buffer,
  options: DetectionOptions = {},
): DetectedFileType | null {
  const { expectedCategory, expectedExtension, expectedMime } = options;

  // 1 Choose candidate list
  let candidates: (typeof FILE_SIGNATURES_BY_CATEGORY)[string] = [];

  if (expectedCategory && FILE_SIGNATURES_BY_CATEGORY[expectedCategory]) {
    candidates = FILE_SIGNATURES_BY_CATEGORY[expectedCategory];
  } else {
    // fallback: all categories
    candidates = Object.values(FILE_SIGNATURES_BY_CATEGORY).flat();
  }

  // 2 Filter by expected extension/mime
  if (expectedExtension) {
    const ext = expectedExtension.toLowerCase();
    candidates = candidates.filter((t) => t.extension.toLowerCase() === ext);
  }

  if (expectedMime) {
    candidates = candidates.filter((t) => t.mime === expectedMime);
  }

  // 3 Check signatures
  for (const type of candidates) {
    if (!type.signatures) continue;
    const matches = type.signatures.every((sig) => matchSignature(buffer, sig));
    if (matches) {
      return {
        category: type.category as FileCategory,
        extension: type.extension,
        mime: type.mime,
      };
    }
  }

  // 4 Optional: fallback full scan
  if (
    candidates.length !==
    Object.values(FILE_SIGNATURES_BY_CATEGORY).flat().length
  ) {
    for (const type of Object.values(FILE_SIGNATURES_BY_CATEGORY).flat()) {
      if (!type.signatures) continue;
      const matches = type.signatures.every((sig) =>
        matchSignature(buffer, sig),
      );
      if (matches) {
        return {
          category: type.category as FileCategory,
          extension: type.extension,
          mime: type.mime,
        };
      }
    }
  }

  return null;
}
