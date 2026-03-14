import path from "path";
import crypto from "crypto";

const WINDOWS_RESERVED = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i;

export interface SanitizeOptions {
  replacement?: string;
  maxLength?: number;
  allowHidden?: boolean;
  allowedExtensions?: string[];
}

export function sanitizeFileName(
  input: string,
  options: SanitizeOptions = {},
): string {
  const {
    replacement = "_",
    maxLength = 255,
    allowHidden = false,
    allowedExtensions,
  } = options;

  if (!input || typeof input !== "string") {
    throw new Error("Filename must be a valid string");
  }

  let name = input.normalize("NFKD");

  // remove directory paths
  name = path.basename(name);

  // remove null bytes
  name = name.replace(/\0/g, "");

  // remove control characters
  name = name.replace(/[\x00-\x1f\x80-\x9f]/g, "");

  // replace invalid filename characters
  name = name.replace(/[\/\\?%*:|"<>]/g, replacement);

  // trim spaces
  name = name.trim();

  // remove trailing dots and spaces
  name = name.replace(/[. ]+$/, "");

  // prevent hidden files
  if (!allowHidden && name.startsWith(".")) {
    name = name.replace(/^\.+/, "");
  }

  const ext = path.extname(name).toLowerCase();
  const base = path.basename(name, ext);

  // extension allowlist
  if (allowedExtensions && !allowedExtensions.includes(ext)) {
    throw new Error(`Extension "${ext}" is not allowed`);
  }

  // windows reserved names
  if (WINDOWS_RESERVED.test(base)) {
    name = "_" + name;
  }

  // enforce length limit
  if (Buffer.byteLength(name, "utf8") > maxLength) {
    const hash = crypto
      .createHash("sha1")
      .update(name)
      .digest("hex")
      .slice(0, 8);

    const allowedBaseLength = maxLength - ext.length - 9;
    const truncatedBase = base.slice(0, allowedBaseLength);

    name = `${truncatedBase}-${hash}${ext}`;
  }

  // fallback if empty
  if (!name) {
    name = crypto.randomUUID();
  }

  return name;
}
