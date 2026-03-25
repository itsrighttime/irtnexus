// src/utils/uuid.ts
import crypto from "crypto";

/**
 * Generate a new UUID and return it as a BINARY(16) buffer.
 * @returns {Buffer} 16-byte buffer representing the UUID
 */
export const generateBinaryUUID = (): Buffer => {
  const uuid = crypto.randomUUID(); // e.g., '3f1e2d4c-7b8a-4f5c-9d2a-1e6a7b8c9d0e'
  return uuidToBuffer(uuid);
};
/**
 * Generate a new UUID and return it as a string.
 * @returns {string} '3f1e2d4c-7b8a-4f5c-9d2a-1e6a7b8c9d0e'
 */
export const generateUUID = (): string => {
  const uuid = crypto.randomUUID(); // e.g., '3f1e2d4c-7b8a-4f5c-9d2a-1e6a7b8c9d0e'
  return uuid;
};

/**
 * Convert a UUID string (36-character) to a 16-byte buffer
 * @param uuid - Standard UUID string
 * @returns Buffer
 */
export const uuidToBuffer = (uuid: string): Buffer => {
  if (!uuid || uuid.length !== 36) {
    throw new TypeError("UUID must be a 36-character string");
  }
  return Buffer.from(uuid.replace(/-/g, ""), "hex");
};

/**
 * Convert a 16-byte buffer back to a UUID string
 * @param input - 16-byte Buffer or array-like object
 * @returns Standard UUID string
 */
export const bufferToUUID = (input: Buffer | ArrayLike<number>): string => {
  let buffer: Buffer;

  if (Buffer.isBuffer(input)) {
    buffer = input;
  } else if (input && typeof input === "object") {
    buffer = Buffer.from(Array.from(input));
  } else {
    throw new TypeError("Invalid buffer input for UUID conversion");
  }

  if (buffer.length !== 16) {
    throw new Error(`Invalid buffer length for UUID: ${buffer.length}`);
  }

  const hex = buffer.toString("hex");
  return hexToDashedUUID(hex);
};

/**
 * Convert a 32-character hex string to standard UUID format
 * @param hex - 32-character hex string
 * @returns UUID string
 */
export const hexToDashedUUID = (hex: string): string => {
  if (hex.length !== 32) {
    throw new Error("Hex string must be 32 characters");
  }
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join("-");
};

/**
 * Convert 32-character hex string to a 16-byte Buffer
 * @param hex - 32-character hex string
 * @returns Buffer
 */
export const hexToBinary = (hex: string): Buffer => {
  if (hex.length !== 32) {
    throw new Error("Hex string must be exactly 32 characters for BINARY(16)");
  }
  return Buffer.from(hex, "hex");
};
