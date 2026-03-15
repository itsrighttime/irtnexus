import { OtpManager } from "./OtpManager";
import { RedisManager } from "./RedisManager";
import { ReservationManager } from "./ReservationManager";

/**
 * OTP Configuration Metadata
 *
 * - ttl: Time-to-live for an OTP in milliseconds (5 minutes)
 * - resendCooldown: Minimum interval before an OTP can be resent (2 minutes)
 * - maxAttempts: Maximum number of OTP validation attempts
 */
export interface OtpMeta {
  ttl: number;
  resendCooldown: number;
  maxAttempts: number;
}

export const otpMeta: OtpMeta = {
  ttl: 5 * 60 * 1000, // 5 minutes
  resendCooldown: 2 * 60 * 1000, // 2 minutes
  maxAttempts: 5,
};

/**
 * OTP Manager
 *
 * Responsible for generating, sending, and validating OTPs.
 * Uses Redis for storage.
 */
export const otpManager = new OtpManager({
  store: new RedisManager("otp:v1:"),
  ttl: otpMeta.ttl,
  resendCooldown: otpMeta.resendCooldown,
  maxAttempts: otpMeta.maxAttempts,
});

/**
 * Reservation Manager
 *
 * Handles temporary reservations (e.g., registration).
 */
export const reservationManager = new ReservationManager({
  store: new RedisManager("reserve:v1:"),
  ttl: otpMeta.ttl,
});
