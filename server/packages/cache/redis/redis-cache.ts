import { Redis } from "ioredis";
import { CacheClient } from "./cache-client";

export class RedisCache implements CacheClient {
  constructor(private redis: Redis) {}

  async get<T>(key: string) {
    const val = await this.redis.get(key);
    return val ? (JSON.parse(val) as T) : null;
  }

  async set<T>(key: string, value: T, ttl?: number) {
    if (ttl) await this.redis.set(key, JSON.stringify(value), "EX", ttl);
    else await this.redis.set(key, JSON.stringify(value));
  }

  async del(key: string) {
    await this.redis.del(key);
  }
  async has(key: string) {
    return (await this.redis.exists(key)) === 1;
  }

  async wrap<T>(key: string, ttl: number, fetcher: () => Promise<T>) {
    const cached = await this.get<T>(key);
    if (cached) return cached;
    const result = await fetcher();
    await this.set(key, result, ttl);
    return result;
  }
}
