import { Signature } from "./types";

export function matchSignature(buffer: Buffer, signature: Signature): boolean {
  const offset = signature.offset ?? 0;
  const bytes = signature.bytes;

  if (buffer.length < offset + bytes.length) {
    return false;
  }

  for (let i = 0; i < bytes.length; i++) {
    if (buffer[offset + i] !== bytes[i]) {
      return false;
    }
  }

  return true;
}
