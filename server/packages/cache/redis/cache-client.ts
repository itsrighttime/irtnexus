export interface CacheClient {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  del(key: string): Promise<void>;
  has(key: string): Promise<boolean>;
  wrap<T>(key: string, ttl: number, fetcher: () => Promise<T>): Promise<T>;
}
