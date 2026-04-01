import { generateUUID } from "#packages/utils/uuid.util.js";
import { TokenProvider } from "./TokenProvider";

export class MagicLinkTokenProvider implements TokenProvider {
  async generate() {
    const raw = generateUUID(); // or signed JWT
    return { raw, hashed: null }; // usually not hashed
  }

  async verify(raw: string, stored: string) {
    return raw === stored;
  }
}
