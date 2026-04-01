export const OTP_CHARSET = {
  NUMERIC: "numeric",
  ALPHA: "alpha",
  ALPHANUMERIC: "alphanumeric",
};

export type OtpCharset = (typeof OTP_CHARSET)[keyof typeof OTP_CHARSET];

export const PASSWORDLESS_METHODS = {
  OTP: "otp",
  MAGIC_LINK: "magic_link",
  // PASSKEY: "passkey",
  // PUSH: "push",
} as const;

export type PasswordlessMethod =
  (typeof PASSWORDLESS_METHODS)[keyof typeof PASSWORDLESS_METHODS];

export const PASSWORDLESS_CHANNEL = {
  EMAIL: "email",
  SMS: "sms",
  WHATSAPP: "whatsapp",
  CALL: "call",
} as const;

export type PasswordlessChannel =
  (typeof PASSWORDLESS_CHANNEL)[keyof typeof PASSWORDLESS_CHANNEL];

export const AUTH_STRATEGY_METHODS = {
  PASSWORD: "password",
  PASSWORDLESS: "passwordless",
  OAUTH: "oauth",
} as const;

export type AuthStrategyMethods = (typeof AUTH_STRATEGY_METHODS)[keyof typeof AUTH_STRATEGY_METHODS];
