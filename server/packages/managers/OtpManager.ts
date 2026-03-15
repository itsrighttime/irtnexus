import crypto from "crypto";

/**
 * Storage interface required by OtpManager
 */
export interface OtpStore<T = unknown> {
  get(key: string): Promise<T | null>;
  set(key: string, value: T, ttlSeconds?: number): Promise<void>;
  verifyAtomic(
    key: string,
    hashedValue: string,
    maxAttempts: number,
  ): Promise<number>;
}

export interface OtpRecord {
  otp: string;
  attempts: number;
  createdAt: number;
  meta?: Record<string, unknown>;
}

export interface OtpManagerOptions {
  store: OtpStore<OtpRecord>;
  ttl: number;
  resendCooldown: number;
  maxAttempts: number;
}

export interface OtpCreateResult {
  success: boolean;
  otp?: string;
  message?: string;
}

export interface OtpVerifyResult {
  success: boolean;
  type?: number;
  message: string;
}

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
  private store: OtpStore<OtpRecord>;
  private ttl: number;
  private resendCooldown: number;
  private maxAttempts: number;

  constructor({ store, ttl, resendCooldown, maxAttempts }: OtpManagerOptions) {
    this.store = store;
    this.ttl = ttl;
    this.resendCooldown = resendCooldown;
    this.maxAttempts = maxAttempts;
  }

  /**
   * Generate a unique key for a user/identifier in the store
   */
  private key(id: string): string {
    return `otp:v1:register:${id}`;
  }

  /**
   * Hash the OTP using SHA256
   */
  private hash(otp: string): string {
    return crypto.createHash("sha256").update(otp).digest("hex");
  }

  /**
   * Generate a 6-digit random OTP
   */
  private generate(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  /**
   * Create or resend an OTP
   */
  async create(
    identifier: string,
    meta: Record<string, unknown> = {},
  ): Promise<OtpCreateResult> {
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
   */
  async verify(identifier: string, otp: string): Promise<OtpVerifyResult> {
    const key = this.key(identifier);
    const hashedOtp = this.hash(otp);

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
        type: 1,
        message: "OTP locked due to too many attempts.",
      };
    }

    return {
      success: false,
      type: 2,
      message: "Invalid OTP. Please check and re-enter.",
    };
  }
}
