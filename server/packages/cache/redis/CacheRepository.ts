// cache/CacheRepository.ts
import crypto from "crypto";
// import { BaseRepository } from "../BaseRepository";
import { CacheClient } from "./cache-client";
import { BaseRepository, RequestContext } from "#packages/database";
import { QueryResultRow } from "pg";

interface SelectCacheOptions {
  ttl?: number;
  cacheKey?: string;
}

export class CacheRepository<
  T extends { id: number },
> extends BaseRepository<T> {
  private cacheClient: CacheClient;
  private ttlSeconds: number;

  constructor(options: any, cacheClient: CacheClient, ttlSeconds = 60) {
    super(options);
    this.cacheClient = cacheClient;
    this.ttlSeconds = ttlSeconds;
  }

  private buildQueryKey(sql: string, params: any[]) {
    const hash = crypto
      .createHash("sha256")
      .update(sql + JSON.stringify(params))
      .digest("hex");

    return `${this.tableName}:query:${hash}`;
  }

  /**
   * Cached SELECT
   */
  async select<R extends QueryResultRow>(
    sql: string,
    params: any[],
    ctx: RequestContext,
    options?: SelectCacheOptions,
  ): Promise<R[]> {
    const key = options?.cacheKey || this.buildQueryKey(sql, params);

    const cached = await this.cacheClient.get<R[]>(key);

    if (cached) {
      return cached;
    }

    const result = await super.select<R>(sql, params, ctx);

    await this.cacheClient.set(key, result, options?.ttl ?? this.ttlSeconds);

    return result;
  }

  /**
   * Cache invalidation
   */
  private async invalidateTableCache() {
    // Implementation depends on cache tagging strategy
    // simplest approach:
    // maintain a set of keys per table
  }

  async create(record: Partial<T>, ctx: RequestContext): Promise<T> {
    const created = await super.create(record, ctx);

    await this.invalidateTableCache();

    return created;
  }

  async update(
    id: number,
    updates: Partial<T>,
    ctx: RequestContext,
  ): Promise<T> {
    const updated = await super.update(id, updates, ctx);

    await this.invalidateTableCache();

    return updated;
  }

  async delete(id: number, ctx: RequestContext): Promise<void> {
    await super.delete(id, ctx);

    await this.invalidateTableCache();
  }
}
