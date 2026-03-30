export const OTP_CHARSET = {
  NUMERIC: "numeric",
  ALPHA: "alpha",
  ALPHANUMERIC: "alphanumeric",
};

export type OtpCharset = (typeof OTP_CHARSET)[keyof typeof OTP_CHARSET];

export const PASSWORDLESS_METHODS = {
  OTP: "otp",
  MAGIC_LINK: "magic_link",
  PASS_KEY: "pass_key",
  PUSH: "push",
} as const;

export type PasswordlessMethodType =
  (typeof PASSWORDLESS_METHODS)[keyof typeof PASSWORDLESS_METHODS];
