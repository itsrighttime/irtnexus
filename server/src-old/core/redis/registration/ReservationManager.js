import crypto from "crypto";

/**
 * ReservationManager
 *
 * Provides a temporary reservation system for:
 * - Email addresses
 * - Usernames
 *
 * Useful for:
 * - Preventing race conditions during registration
 * - Holding resources temporarily until a process completes
 */
export class ReservationManager {
  /**
   * @param {Object} params
   * @param {Object} params.store - Storage interface with atomic reservation methods
   * @param {number} params.ttl - Time to live (ms) for reservations
   */
  constructor({ store, ttl }) {
    this.store = store;
    this.ttl = ttl;
  }

  /* ========================
     Key Generators
  ======================== */

  emailKey(email) {
    return `reserve:v1:email:${email}`;
  }

  usernameKey(username) {
    return `reserve:v1:username:${username}`;
  }

  tokenKey(token) {
    return `reserve:v1:token:${token}`;
  }

  /* ========================
     Reservation Operations
  ======================== */

  /**
   * Reserve an email and username atomically
   * @param {Object} param0
   * @param {string} param0.email
   * @param {string} param0.username
   * @returns {Object} { success: boolean, token?: string }
   */
  async reserve({ email, username }) {
    const token = crypto.randomUUID();

    // Atomically reserve all keys
    const ok = await this.store.reserveAtomic(
      this.emailKey(email),
      this.usernameKey(username),
      this.tokenKey(token),
      { email, username },
      this.ttl,
    );

    if (!ok) return { success: false }; // reservation failed (already taken)

    return { success: true, token };
  }

  /**
   * Retrieve reservation details by token
   * @param {string} token
   * @returns {Object|null}
   */
  async get(token) {
    return this.store.get(this.tokenKey(token));
  }

  /**
   * Consume a reservation, removing all associated keys
   * @param {string} token
   * @returns {boolean} success
   */
  async consume(token) {
    const data = await this.get(token);
    if (!data) return false;

    // Delete all keys atomically or sequentially
    await this.store.delete(this.emailKey(data.email));
    await this.store.delete(this.usernameKey(data.username));
    await this.store.delete(this.tokenKey(token));

    return true;
  }
}
