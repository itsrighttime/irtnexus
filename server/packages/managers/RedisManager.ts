import { redis } from "#configs";

/**
 * Generic Enterprise Redis Adapter
 *
 * - Centralizes all Redis access
 * - Supports namespaces/prefixes
 * - Supports TTL per key
 * - Provides common atomic operations
 */
export class RedisManager<T = unknown> {
  private redis: typeof redis;
  private namespace: string;

  /**
   * @param namespace Optional prefix for keys (e.g., 'otp:v1:')
   */
  constructor(namespace: string = "") {
    this.redis = redis;
    this.namespace = namespace;
  }

  /**
   * Generates the final key including namespace
   */
  private key(key: string): string {
    return `${this.namespace}${key}`;
  }

  /** ===============================
   * Basic Operations
   * =============================== */

  async get(key: string): Promise<T | null> {
    const val = await this.redis.get(this.key(key));
    return val ? (JSON.parse(val) as T) : null;
  }

  async set(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const args: (string | number)[] = [this.key(key), JSON.stringify(value)];

    if (ttlSeconds) {
      args.push("EX", ttlSeconds);
    }

    await this.redis.set(...(args as [string, string]));
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(this.key(key));
  }

  /** ===============================
   * Atomic / Transactional Operations
   * =============================== */

  /**
   * Atomic verification (e.g., OTP)
   * Lua ensures single-step read/update
   */
  async verifyAtomic(
    key: string,
    hashedValue: string,
    maxAttempts: number,
  ): Promise<number> {
    const lua = `
      local val = redis.call("GET", KEYS[1])
      if not val then return 0 end
      local data = cjson.decode(val)
      if data.attempts >= tonumber(ARGV[2]) then return -1 end
      if data.otp == ARGV[1] then
        redis.call("DEL", KEYS[1])
        return 1
      else
        data.attempts = data.attempts + 1
        redis.call("SET", KEYS[1], cjson.encode(data))
        return 0
      end
    `;

    return this.redis.eval(
      lua,
      1,
      this.key(key),
      hashedValue,
      maxAttempts,
    ) as Promise<number>;
  }

  /**
   * Atomic reservation
   * Ensures all keys are reserved together
   */
  async reserveAtomic(
    keys: string[],
    data: T,
    ttlSeconds: number,
  ): Promise<boolean> {
    const lua = `
    for i=1,#KEYS do
      if redis.call("EXISTS", KEYS[i]) == 1 then return 0 end
    end
    for i=1,#KEYS do
      redis.call("SET", KEYS[i], cjson.encode(ARGV[1]), "EX", tonumber(ARGV[2]))
    end
    return 1
  `;

    const namespacedKeys = keys.map((k) => this.key(k));

    const ok = await this.redis.eval(
      lua,
      namespacedKeys.length,
      ...namespacedKeys,
      JSON.stringify(data),
      ttlSeconds,
    );

    return ok === 1;
  }

  /** ===============================
   * Counter / Rate Limiting
   * =============================== */

  /**
   * Increment a numeric counter with optional TTL
   */
  async increment(key: string, ttlSeconds?: number): Promise<number> {
    const count = await this.redis.incr(this.key(key));

    if (ttlSeconds) {
      await this.redis.expire(this.key(key), ttlSeconds);
    }

    return count;
  }

  /** ===============================
   * Utility
   * =============================== */

  async exists(key: string): Promise<boolean> {
    return (await this.redis.exists(this.key(key))) === 1;
  }
}
