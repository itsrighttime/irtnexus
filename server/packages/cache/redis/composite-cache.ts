import { CacheClient } from "./cache-client";

export class CompositeCache implements CacheClient {
  constructor(
    private local: CacheClient,
    private remote: CacheClient,
  ) {}

  async get<T>(key: string) {
    let val = await this.local.get<T>(key);
    if (val) return val;
    val = await this.remote.get<T>(key);
    if (val) await this.local.set(key, val); // warm local cache
    return val;
  }

  async set<T>(key: string, value: T, ttl?: number) {
    await this.local.set(key, value, ttl);
    await this.remote.set(key, value, ttl);
  }

  async del(key: string) {
    await this.local.del(key);
    await this.remote.del(key);
  }

  async has(key: string) {
    return (await this.local.has(key)) || (await this.remote.has(key));
  }

  async wrap<T>(key: string, ttl: number, fetcher: () => Promise<T>) {
    const cached = await this.get<T>(key);
    if (cached) return cached;
    const result = await fetcher();
    await this.set(key, result, ttl);
    return result;
  }
}
