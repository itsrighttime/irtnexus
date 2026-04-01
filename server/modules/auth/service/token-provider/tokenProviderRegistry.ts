import { PASSWORDLESS_METHODS } from "../../const";
import { MagicLinkTokenProvider } from "./MagicLinkTokenProvider";
import { OtpTokenProvider } from "./OtpTokenProvider";

export const tokenProviderRegistry = {
  [PASSWORDLESS_METHODS.OTP]: new OtpTokenProvider(),
  [PASSWORDLESS_METHODS.MAGIC_LINK]: new MagicLinkTokenProvider(),
};
