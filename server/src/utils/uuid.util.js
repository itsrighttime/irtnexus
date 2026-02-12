import crypto from "crypto";

/**
 * Generate a new UUID and return it as a BINARY(16) buffer.
 * This function creates a UUID string and converts it to a 16-byte binary format,
 * suitable for storage in MySQL as a BINARY(16) field.
 *
 * @returns {Buffer} 16-byte buffer representing the UUID
 */
export const generateBinaryUUID = () => {
  const uuid = crypto.randomUUID(); // Generates a standard UUID string (e.g., '3f1e2d4c-7b8a-4f5c-9d2a-1e6a7b8c9d0e')
  return uuidToBuffer(uuid); // Convert UUID string to a 16-byte buffer
};

/**
 * Convert a UUID string (36-character format) to a Buffer for BINARY(16).
 * This function removes the dashes from the UUID string and converts the
 * remaining hexadecimal characters into a 16-byte buffer.
 *
 * @param {string} uuid - UUID string in the standard 36-character format
 *                         (e.g., '3f1e2d4c-7b8a-4f5c-9d2a-1e6a7b8c9d0e')
 *
 * @returns {Buffer} 16-byte buffer representing the UUID
 *
 * @example
 * uuidToBuffer('3f1e2d4c-7b8a-4f5c-9d2a-1e6a7b8c9d0e');
 * // Returns: <Buffer 3f 1e 2d 4c 7b 8a 4f 5c 9d 2a 1e 6a 7b 8c 9d 0e>
 */
export const uuidToBuffer = (uuid) => {
  // Remove dashes and convert the remaining hex string into a buffer
  return Buffer.from(uuid.replace(/-/g, ""), "hex");
};

/**
 * Convert a BINARY(16) buffer back to a UUID string.
 * This function takes a 16-byte buffer, converts it to a hexadecimal string,
 * and formats it back into a standard UUID string (with dashes).
 *
 * @param {Buffer} buffer - 16-byte buffer representing a UUID in BINARY(16)
 *
 * @returns {string} UUID string in the standard 36-character format
 *                  (e.g., '3f1e2d4c-7b8a-4f5c-9d2a-1e6a7b8c9d0e')
 *
 * @example
 * bufferToUUID(<Buffer 3f 1e 2d 4c 7b 8a 4f 5c 9d 2a 1e 6a 7b 8c 9d 0e>);
 * // Returns: '3f1e2d4c-7b8a-4f5c-9d2a-1e6a7b8c9d0e'
 */
export const bufferToUUID = (buffer) => {
  // Convert buffer to a hex string and format as a UUID
  const hex = buffer.toString("hex");
  return [
    hex.slice(0, 8), // 8 characters for the first section
    hex.slice(8, 12), // 4 characters for the second section
    hex.slice(12, 16), // 4 characters for the third section
    hex.slice(16, 20), // 4 characters for the fourth section
    hex.slice(20, 32), // 12 characters for the final section
  ].join("-"); // Join the sections with dashes
};

export const hexToDashedUUID = (hex) => {
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join("-");
};

/*
 * @example
 * const buffer = hexToBinary('aece55bea992443a8af8d2cfa5bd97e6');
 * console.log(buffer); // <Buffer ae ce 55 be a9 92 44 3a 8a f8 d2 cf a5 bd 97 e6>
 */
export const hexToBinary = (hex) => {
  if (hex.length !== 32) {
    throw new Error("Hex string must be exactly 32 characters for BINARY(16)");
  }
  return Buffer.from(hex, "hex");
};
