import { OTP_CHARSET, OtpCharset } from "../../const";

export function generateOtp(
  length = 6,
  charset: OtpCharset = OTP_CHARSET.NUMERIC,
): string {
  let chars = "";
  if (charset === OTP_CHARSET.NUMERIC) chars = "0123456789";
  if (charset === OTP_CHARSET.ALPHA)
    chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (charset === OTP_CHARSET.ALPHANUMERIC)
    chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += chars[Math.floor(Math.random() * chars.length)];
  }
  return otp;
}
