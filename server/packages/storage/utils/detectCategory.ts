import { FILE_CATEGORIES_LIST } from "../types/fileTypes";

export function detectCategory(extension: string) {
  for (const [category, extensions] of Object.entries(FILE_CATEGORIES_LIST)) {
    if (extensions.includes(extension)) return category;
  }

  return "unknown";
}
