import { PoolClient, QueryResultRow } from "pg";
import { pool, replicaPool } from "./connection"; // replicaPool for read replicas
import { versionQueue, writeQueue } from "./queue"; // separate async queues
import {
  BaseRepositoryOptions,
  VersionEntry,
  DB_RequestContext,
  ColumnOptions,
} from "./types";
import { QuerySecurityEngine } from "./QuerySecurityEngine";
import { logger } from "#utils";

export class BaseRepository<T extends QueryResultRow> {
  protected tableName: string;
  protected versionTableName: string;
  protected asyncVersioning: boolean;
  protected asyncWrites: boolean;
  protected primaryKey: string;

  constructor(options: BaseRepositoryOptions) {
    this.tableName = options.tableName;
    this.versionTableName = options.versionTableName;
    this.primaryKey = options.primaryKey;
    this.asyncVersioning = options.asyncVersioning ?? false;
    this.asyncWrites = options.asyncWrites ?? false;
  }

  /** ----------------- Transaction Management ----------------- */

  private txnBegin = async (release: boolean, db: PoolClient) => {
    if (release) {
      logger.debug(
        `Starting transaction`,
        { table: this.tableName },
        "DB_TX_BEGIN",
      );

      await db.query("BEGIN");
    }
  };

  private txnCommit = async (release: boolean, db: PoolClient) => {
    if (release) {
      await db.query("COMMIT");

      logger.debug(
        `Transaction committed`,
        { table: this.tableName },
        "DB_TX_COMMIT",
      );
    }
  };

  private txnRollback = async (
    release: boolean,
    db: PoolClient,
    err: Error,
  ) => {
    if (release) {
      await db.query("ROLLBACK");

      logger.error(`Transaction rolled back`, err, "DB_TX_ROLLBACK");
    }
  };

  /** ----------------- Get Client (Primary or Replica) ----------------- */

  private async getClient(client?: PoolClient, readReplica = false) {
    if (client) {
      logger.debug(
        `Using existing transaction client`,
        { table: this.tableName },
        "DB_CLIENT_REUSE",
      );

      return { client, release: false };
    }

    const newClient = readReplica
      ? await replicaPool.connect()
      : await pool.connect();

    logger.debug(
      `Acquired new ${readReplica ? "replica" : "primary"} DB client`,
      { table: this.tableName },
      "DB_CLIENT_NEW",
    );

    return { client: newClient, release: true };
  }

  /**
   * Return columns string for SQL queries
   */
  protected columnsFor(options?: ColumnOptions<T>): string {
    // Get all keys of the type T
    const allKeys = Object.keys({} as T) as (keyof T)[];

    let keys = allKeys;

    if (options?.include) {
      keys = options.include;
    }

    if (options?.exclude) {
      keys = keys.filter((k) => !options.exclude!.includes(k));
    }

    // Convert to string ready for SQL SELECT
    return keys.map((k) => `"${String(k)}"`).join(", ");
  }

  protected extractRows<R>(result: R | R[] | null | undefined): R[] {
    if (!result) return [];

    // If it's already an array
    if (Array.isArray(result)) {
      // If first element is array (e.g., nested result from certain queries), flatten it
      if (result.length > 0 && Array.isArray(result[0])) {
        return result[0] as R[];
      }
      return result as R[];
    }

    // If single object, wrap it in an array
    return [result] as R[];
  }

  /** ----------------- CREATE ----------------- */

  async create(
    record: Partial<T>,
    ctx: DB_RequestContext,
    client?: PoolClient,
  ): Promise<T> {
    if (this.asyncWrites) {
      // Push write to async queue → eventual consistency
      await writeQueue.add("insertRecord", {
        table: this.tableName,
        data: record,
        context: ctx,
      });
      logger.info(
        `Async write queued`,
        { table: this.tableName, record },
        "DB_ASYNC_CREATE",
      );
      return { id: -1 } as any; // placeholder id
    }

    // Strong consistent write (default)
    const { client: db, release } = await this.getClient(client);

    try {
      await this.txnBegin(release, db);

      const fields = Object.keys(record).join(", ");
      const values = Object.values(record);
      const placeholders = values.map((_, i) => `$${i + 1}`).join(", ");

      const query = `
        INSERT INTO ${this.tableName}
        (${fields})
        VALUES (${placeholders})
        RETURNING *
      `;

      logger.debug(
        `Executing CREATE`,
        {
          table: this.tableName,
          record,
          tenantId: ctx.tenantId,
          userId: ctx.userId,
        },
        "DB_CREATE_START",
      );

      const { rows } = await db.query<T>(query, values);

      const created = rows[0];

      await this.handleVersioning(db, {
        recordId: (created as any)[this.primaryKey],
        data: created,
        operation: "CREATE",
        performedBy: ctx.userId,
        performedAt: new Date(),
      });

      await this.txnCommit(release, db);

      logger.info(
        `Record created`,
        {
          table: this.tableName,
          id: (created as any).id,
          tenantId: ctx.tenantId,
        },
        "DB_CREATE_SUCCESS",
      );

      return created;
    } catch (err: any) {
      logger.error(`Create failed`, err, "DB_CREATE_ERROR");

      await this.txnRollback(release, db, err);
      throw err;
    } finally {
      if (release) db.release();
    }
  }

  /** ----------------- UPDATE ----------------- */

  async update(
    id: number,
    updates: Partial<T>,
    ctx: DB_RequestContext,
    client?: PoolClient,
  ): Promise<T> {
    if (this.asyncWrites) {
      await writeQueue.add("updateRecord", {
        table: this.tableName,
        id,
        updates,
        context: ctx,
      });
      logger.info(
        `Async update queued`,
        { table: this.tableName, id, updates },
        "DB_ASYNC_UPDATE",
      );
      return { id } as any; // placeholder
    }

    const { client: db, release } = await this.getClient(client);

    try {
      await this.txnBegin(release, db);

      const setClauses = Object.keys(updates)
        .map((key, i) => `${key}=$${i + 1}`)
        .join(", ");

      const values = Object.values(updates);

      values.push(id);

      const query = `
        UPDATE ${this.tableName}
        SET ${setClauses},
            updated_at = NOW()
        WHERE ${this.primaryKey} = $${values.length}
        AND is_deleted = FALSE
        RETURNING *
      `;

      const { rows } = await db.query<T>(query, values);

      const updated = rows[0];

      await this.handleVersioning(db, {
        recordId: id,
        data: updated,
        operation: "UPDATE",
        performedBy: ctx.userId,
        performedAt: new Date(),
      });

      await this.txnCommit(release, db);

      logger.info(
        `Record updated`,
        {
          table: this.tableName,
          id,
          tenantId: ctx.tenantId,
        },
        "DB_UPDATE_SUCCESS",
      );

      return updated;
    } catch (err: any) {
      logger.error(`Update failed`, err, "DB_UPDATE_ERROR");
      await this.txnRollback(release, db, err);
      throw err;
    } finally {
      if (release) db.release();
    }
  }

  /** ----------------- DELETE ----------------- */

  async delete(
    id: number,
    ctx: DB_RequestContext,
    client?: PoolClient,
  ): Promise<void> {
    if (this.asyncWrites) {
      await writeQueue.add("deleteRecord", {
        table: this.tableName,
        id,
        context: ctx,
      });
      logger.info(
        `Async delete queued`,
        { table: this.tableName, id },
        "DB_ASYNC_DELETE",
      );
      return;
    }

    const { client: db, release } = await this.getClient(client);

    try {
      await this.txnBegin(release, db);

      const { rows } = await db.query<T>(
        `SELECT * FROM ${this.tableName}
         WHERE ${this.primaryKey} = $1 AND is_deleted = FALSE`,
        [id],
      );

      if (!rows.length) throw new Error("Record not found");

      const existing = rows[0];

      await db.query(
        `UPDATE ${this.tableName}
         SET is_deleted = TRUE,
             deleted_at = NOW(),
             deleted_by = $2
         WHERE ${this.primaryKey} = $1`,
        [id, ctx.userId],
      );

      await this.handleVersioning(db, {
        recordId: id,
        data: existing,
        operation: "DELETE",
        performedBy: ctx.userId,
        performedAt: new Date(),
      });

      await this.txnCommit(release, db);
      logger.warn(
        `Record soft deleted`,
        {
          table: this.tableName,
          id,
          tenantId: ctx.tenantId,
        },
        "DB_SOFT_DELETE_SUCCESS",
      );
    } catch (err: any) {
      logger.error(`Deletion failed`, err, "DB_SOFT_DELETE_ERROR");
      await this.txnRollback(release, db, err);
      throw err;
    } finally {
      if (release) db.release();
    }
  }

  /** ----------------- READ ----------------- */

  async findById(
    id: number,
    client?: PoolClient,
    readReplica = false,
  ): Promise<T | null> {
    const { client: db, release } = await this.getClient(client, readReplica);
    const columns = this.columnsFor();

    try {
      const { rows } = await db.query<T>(
        `SELECT ${columns}
         FROM ${this.tableName}
         WHERE ${this.primaryKey} = $1
         AND is_deleted = FALSE`,
        [id],
      );

      return rows[0] || null;
    } finally {
      if (release) db.release();
    }
  }

  /** SELECT */
  async select<R extends QueryResultRow>(
    sql: string,
    params: any[] = [],
    ctx: DB_RequestContext,
    client?: PoolClient,
    readReplica = false,
  ): Promise<R[]> {
    const { client: db, release } = await this.getClient(client, readReplica);
    try {
      const finalSql = QuerySecurityEngine.rewrite(sql, ctx, params);

      logger.debug(
        `Executing SELECT`,
        {
          originalQuery: sql,
          rewrittenQuery: finalSql,
          params,
          tenantId: ctx.tenantId,
        },
        "DB_SELECT_EXEC",
      );

      const start = Date.now();
      const { rows } = await db.query<R>(finalSql, params);
      logger.verbose(
        `SELECT completed`,
        {
          rows: rows.length,
          table: this.tableName,
          durationMs: Date.now() - start,
        },
        "DB_SELECT_SUCCESS",
      );

      return this.extractRows(rows);
    } finally {
      if (release) db.release();
    }
  }

  /** ----------------- VERSIONING ----------------- */

  private async handleVersioning(client: PoolClient, entry: VersionEntry<T>) {
    if (this.asyncVersioning) {
      await versionQueue.add("versioning", {
        table: this.versionTableName,
        entry,
      });
      logger.debug(
        `Queued async versioning`,
        {
          table: this.versionTableName,
          recordId: entry.recordId,
          operation: entry.operation,
        },
        "DB_VERSION_ASYNC",
      );
      return;
    }

    const fields = Object.keys(entry.data).join(", ");
    const values = Object.values(entry.data);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(", ");

    const query = `
      INSERT INTO ${this.versionTableName}
      (record_id, ${fields}, operation_type, performed_by, performed_at)
      VALUES ($${values.length + 1}, ${placeholders},
              $${values.length + 2}, $${values.length + 3}, $${values.length + 4})
    `;

    await client.query(query, [
      entry.recordId,
      ...values,
      entry.operation,
      entry.performedBy,
      entry.performedAt,
    ]);

    logger.debug(
      `Writing version entry`,
      {
        table: this.versionTableName,
        recordId: entry.recordId,
        operation: entry.operation,
      },
      "DB_VERSION_SYNC",
    );
  }
}
