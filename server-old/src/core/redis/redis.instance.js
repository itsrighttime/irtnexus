import { redis } from "#config/redis.config.js";
import { OtpManager } from "./otp/OtpManager.js";
import { ReservationManager } from "./registration/ReservationManager.js";
import { RedisService } from "./RedisService.js";

/**
 * OTP Configuration Metadata
 *
 * This object contains the default settings for OTP generation and validation:
 * - ttl: Time-to-live for an OTP in milliseconds (5 minutes).
 * - resendCooldown: Minimum time interval before an OTP can be resent (2 minutes).
 * - maxAttempts: Maximum number of attempts allowed for entering an OTP.
 */
export const otpMeta = {
  ttl: 5 * 60 * 1000, // 5 minutes in milliseconds
  resendCooldown: 2 * 60 * 1000, // 2 minutes in milliseconds
  maxAttempts: 5, // Maximum number of OTP validation attempts
};

/**
 * OTP Manager
 *
 * Responsible for generating, sending, and validating OTPs. Uses Redis for storage.
 * Configured with:
 * - store: RedisStore instance for persisting OTPs
 * - ttl: OTP expiration time
 * - resendCooldown: Minimum interval between OTP resend requests
 * - maxAttempts: Maximum OTP validation attempts allowed
 */
export const otpManager = new OtpManager({
  store: new RedisService("otp:v1:"),
  ttl: otpMeta.ttl,
  resendCooldown: otpMeta.resendCooldown,
  maxAttempts: otpMeta.maxAttempts,
});

/**
 * Reservation Manager
 *
 * Handles temporary reservations (e.g., for registration or booking) using Redis.
 * Configured with:
 * - store: RedisStore instance for persisting reservations
 * - ttl: Reservation expiration time (same as OTP TTL by default)
 */
export const reservationManager = new ReservationManager({
  store: new RedisService("reserve:v1:"),
  ttl: otpMeta.ttl,
});
