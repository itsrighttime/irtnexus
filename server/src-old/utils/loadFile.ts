import fs from "fs/promises";
import path from "path";

/**
 * Load a file from a given location.
 * @param filePath - Relative or absolute path to the file.
 * @returns Promise<string> - Resolves to file content as string.
 */
export async function loadFile(filePath: string): Promise<string> {
  try {
    const absolutePath = path.resolve(filePath);
    const content = await fs.readFile(absolutePath, "utf-8");
    return content;
  } catch (err) {
    console.error(`Error reading file at ${filePath}:`, err);
    throw err;
  }
}
