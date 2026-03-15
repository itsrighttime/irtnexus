import crypto from "crypto";

/**
 * Storage interface required by ReservationManager
 */
export interface ReservationStore<T = unknown> {
  get(key: string): Promise<T | null>;
  delete(key: string): Promise<void>;
  reserveAtomic(keys: string[], data: T, ttlSeconds: number): Promise<boolean>;
}

export interface ReservationRecord {
  email: string;
  username: string;
}

export interface ReservationOptions {
  store: ReservationStore<ReservationRecord>;
  ttl: number;
}

export interface ReservationResult {
  success: boolean;
  token?: string;
}

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
  private store: ReservationStore<ReservationRecord>;
  private ttl: number;

  constructor({ store, ttl }: ReservationOptions) {
    this.store = store;
    this.ttl = ttl;
  }

  /* ========================
     Key Generators
  ======================== */

  private emailKey(email: string): string {
    return `reserve:v1:email:${email}`;
  }

  private usernameKey(username: string): string {
    return `reserve:v1:username:${username}`;
  }

  private tokenKey(token: string): string {
    return `reserve:v1:token:${token}`;
  }

  /* ========================
     Reservation Operations
  ======================== */

  /**
   * Reserve an email and username atomically
   */
  async reserve({
    email,
    username,
  }: {
    email: string;
    username: string;
  }): Promise<ReservationResult> {
    const token = crypto.randomUUID();

    const ok = await this.store.reserveAtomic(
      [this.emailKey(email), this.usernameKey(username), this.tokenKey(token)],
      { email, username },
      this.ttl,
    );

    if (!ok) return { success: false };

    return { success: true, token };
  }

  /**
   * Retrieve reservation details by token
   */
  async get(token: string): Promise<ReservationRecord | null> {
    return this.store.get(this.tokenKey(token));
  }

  /**
   * Consume a reservation, removing all associated keys
   */
  async consume(token: string): Promise<boolean> {
    const data = await this.get(token);
    if (!data) return false;

    await this.store.delete(this.emailKey(data.email));
    await this.store.delete(this.usernameKey(data.username));
    await this.store.delete(this.tokenKey(token));

    return true;
  }
}
