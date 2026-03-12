import NodeCache from "node-cache";
import { CacheClient } from "./cache-client";

export class InMemoryCache implements CacheClient {
  private cache = new NodeCache();

  async get<T>(key: string) {
    return this.cache.get<T>(key) ?? null;
  }
  async set<T>(key: string, value: T, ttl: number) {
    this.cache.set(key, value, ttl);
  }
  async del(key: string) {
    this.cache.del(key);
  }
  async has(key: string) {
    return this.cache.has(key);
  }
  async wrap<T>(key: string, ttl: number, fetcher: () => Promise<T>) {
    const cached = await this.get<T>(key);
    if (cached) return cached;
    const result = await fetcher();
    await this.set(key, result, ttl);
    return result;
  }
}
