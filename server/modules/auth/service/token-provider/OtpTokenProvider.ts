import { compareHashText, hashText } from "#packages/utils";
import { generateOtp } from "../helper/generateOtp";
import { TokenProvider } from "./TokenProvider";

export class OtpTokenProvider implements TokenProvider {
  async generate({ length = 6, charset }: any) {
    const raw = generateOtp(length, charset);
    const hashed = await hashText(raw);

    return { raw, hashed };
  }

  async verify(raw: string, stored: string) {
    return compareHashText(raw, stored);
  }
}
