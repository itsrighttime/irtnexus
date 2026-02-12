import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class RedisStore {
  constructor(redis) {
    this.redis = redis;

    // Load Lua scripts for atomic operations
    this.verifyOtpScript = fs.readFileSync(
      path.join(__dirname, "./verifyOtp.lua"),
      "utf8",
    );

    this.reserveScript = fs.readFileSync(
      path.join(__dirname, "./reserveIdentifier.lua"),
      "utf8",
    );
  }

  /* ---------------- BASIC GET/SET/DELETE ---------------- */

  async get(key) {
    const val = await this.redis.get(key);
    return val ? JSON.parse(val) : null;
  }

  async set(key, value, ttlMs) {
    await this.redis.set(key, JSON.stringify(value), "PX", ttlMs);
  }

  async delete(key) {
    await this.redis.del(key);
  }

  /* ---------------- OTP ---------------- */

  /**
   * Atomically verify an OTP and increment attempt count
   * Uses Lua script for atomicity
   * @param {string} key Redis key
   * @param {string} hashedOtp SHA256 hashed OTP
   * @param {number} maxAttempts Maximum allowed attempts
   * @returns {number} Lua return code:
   * 1 = success, 0 = invalid, -1 = max attempts exceeded
   */
  async verifyAtomic(key, hashedOtp, maxAttempts) {
    return this.redis.eval(
      this.verifyOtpScript,
      1,
      key,
      hashedOtp,
      maxAttempts,
    );
  }

  /* ---------------- RESERVATION ---------------- */

  /**
   * Atomically reserve email, username, and token
   * Uses Lua script for atomicity
   * @param {string} emailKey
   * @param {string} usernameKey
   * @param {string} tokenKey
   * @param {Object} payload
   * @param {number} ttlMs
   * @returns {boolean} true if reservation succeeded
   */
  async reserveAtomic(emailKey, usernameKey, tokenKey, payload, ttlMs) {
    return this.redis.eval(
      this.reserveScript,
      3, // number of keys in the script
      emailKey,
      usernameKey,
      tokenKey,
      ttlMs,
      JSON.stringify(payload),
    );
  }
}
