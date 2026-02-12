import { translate } from "#translations";
import { HTTP_STATUS, RESPONSE } from "#utils";
import crypto from "crypto";

/**
 * OTP Manager
 *
 * Handles:
 * - OTP generation
 * - TTL / expiration
 * - Resend cooldown
 * - Max attempts with atomic verification
 */
export class OtpManager {
  /**
   * @param {Object} params
   * @param {Object} params.store - A storage interface with `get`, `set`, `verifyAtomic`
   * @param {number} params.ttl - Time to live (ms) for OTP
   * @param {number} params.resendCooldown - Cooldown period (ms) for resending
   * @param {number} params.maxAttempts - Max verification attempts
   */
  constructor({ store, ttl, resendCooldown, maxAttempts }) {
    this.store = store;
    this.ttl = ttl;
    this.resendCooldown = resendCooldown;
    this.maxAttempts = maxAttempts;
  }

  /**
   * Generate a unique key for a user/identifier in the store
   * @param {string} id
   * @returns {string}
   */
  key(id) {
    return `otp:v1:register:${id}`;
  }

  /**
   * Hash the OTP using SHA256
   * @param {string} otp
   * @returns {string}
   */
  hash(otp) {
    return crypto.createHash("sha256").update(otp).digest("hex");
  }

  /**
   * Generate a 6-digit random OTP
   * @returns {string}
   */
  generate() {
    return crypto.randomInt(100000, 999999).toString();
  }

  /**
   * Create or resend an OTP
   * @param {string} identifier
   * @param {Object} meta - Optional metadata to store with OTP
   */
  async create(identifier, meta = {}) {
    const key = this.key(identifier);
    const existing = await this.store.get(key);

    // Enforce resend cooldown
    if (existing && Date.now() - existing.createdAt < this.resendCooldown) {
      return {
        success: false,
        message:
          "Cooldown is active, OTP already sent. Please wait before requesting again.",
      };
    }

    const otp = this.generate();

    await this.store.set(
      key,
      {
        otp: this.hash(otp),
        attempts: 0,
        createdAt: Date.now(),
        meta,
      },
      this.ttl,
    );

    return { success: true, otp };
  }

  /**
   * Verify an OTP
   * @param {string} identifier
   * @param {string} otp
   */
  async verify(identifier, otp) {
    const key = this.key(identifier);
    const hashedOtp = this.hash(otp);

    // Atomic verification (Lua script or transactional operation)
    const result = await this.store.verifyAtomic(
      key,
      hashedOtp,
      this.maxAttempts,
    );

    /**
     * Lua return codes:
     *  1  = success
     *  0  = invalid OTP
     * -1  = max attempts exceeded
     */

    if (result === 1) {
      return { success: true, message: "OTP validated successfully." };
    }

    if (result === -1) {
      return {
        success: false,
        type: 1, // locked
        message: "OTP locked due to too many attempts.",
      };
    }

    return {
      success: false,
      type: 2, // invalid OTP
      message: "Invalid OTP. Please check and re-enter.",
    };
  }
}
