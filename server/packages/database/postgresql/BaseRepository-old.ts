import { PoolClient, QueryResultRow } from "pg";
import { pool } from "./connection";
import { versionQueue } from "./queue";
import { BaseRepositoryOptions, VersionEntry, RequestContext } from "./types";
import { QuerySecurityEngine } from "./QuerySecurityEngine";
import { logger } from "#utils";

export class BaseRepository<T extends QueryResultRow> {
  protected tableName: string;
  protected versionTableName: string;
  protected asyncVersioning: boolean;

  constructor(options: BaseRepositoryOptions) {
    this.tableName = options.tableName;
    this.versionTableName = options.versionTableName;
    this.asyncVersioning = options.asyncVersioning ?? false;
  }

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

  private async getClient(client?: PoolClient) {
    if (client) {
      logger.debug(
        `Using existing transaction client`,
        { table: this.tableName },
        "DB_CLIENT_REUSE",
      );

      return { client, release: false };
    }

    const newClient = await pool.connect();

    logger.debug(
      `Acquired new DB client`,
      { table: this.tableName },
      "DB_CLIENT_NEW",
    );

    return {
      client: newClient,
      release: true,
    };
  }

  /** CREATE */

  async create(
    record: Partial<T>,
    ctx: RequestContext,
    client?: PoolClient,
  ): Promise<T> {
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
        recordId: (created as any).id,
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

  /** UPDATE */

  async update(
    id: number,
    updates: Partial<T>,
    ctx: RequestContext,
    client?: PoolClient,
  ): Promise<T> {
    const { client: db, release } = await this.getClient(client);

    try {
      await this.txnBegin(release, db);

      logger.debug(
        `Executing UPDATE`,
        {
          table: this.tableName,
          id,
          updates,
          tenantId: ctx.tenantId,
        },
        "DB_UPDATE_START",
      );

      const setClauses = Object.keys(updates)
        .map((key, i) => `${key}=$${i + 1}`)
        .join(", ");

      const values = Object.values(updates);

      values.push(id);

      const query = `
        UPDATE ${this.tableName}
        SET ${setClauses},
            updated_at = NOW()
        WHERE id = $${values.length}
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
      logger.error(`Updation failed`, err, "DB_UPDATE_ERROR");

      await this.txnRollback(release, db, err);
      throw err;
    } finally {
      if (release) db.release();
    }
  }

  /** SOFT DELETE */

  async delete(
    id: number,
    ctx: RequestContext,
    client?: PoolClient,
  ): Promise<void> {
    const { client: db, release } = await this.getClient(client);

    try {
      await this.txnBegin(release, db);

      logger.debug(
        `Executing SOFT DELETE`,
        {
          table: this.tableName,
          id,
          userId: ctx.userId,
        },
        "DB_DELETE_START",
      );

      const { rows } = await db.query<T>(
        `SELECT * FROM ${this.tableName}
         WHERE id=$1 AND is_deleted = FALSE`,
        [id],
      );

      if (!rows.length) throw new Error("Record not found");

      const existing = rows[0];

      await db.query(
        `UPDATE ${this.tableName}
         SET is_deleted = TRUE,
             deleted_at = NOW(),
             deleted_by = $2
         WHERE id = $1`,
        [id, ctx.userId],
      );

      await this.handleVersioning(db, {
        recordId: id,
        data: existing,
        operation: "DELETE",
        performedBy: ctx.userId,
        performedAt: new Date(),
      });

      logger.warn(
        `Record soft deleted`,
        {
          table: this.tableName,
          id,
          tenantId: ctx.tenantId,
        },
        "DB_SOFT_DELETE_SUCCESS",
      );

      await this.txnCommit(release, db);
    } catch (err: any) {
      logger.error(`Deletion failed`, err, "DB_SOFT_DELETE_ERROR");
      await this.txnRollback(release, db, err);
      throw err;
    } finally {
      if (release) db.release();
    }
  }

  /** FIND BY ID */

  async findById(id: number, client?: PoolClient): Promise<T | null> {
    const { client: db, release } = await this.getClient(client);

    try {
      const { rows } = await db.query<T>(
        `SELECT *
         FROM ${this.tableName}
         WHERE id = $1
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
    ctx: RequestContext,
    client?: PoolClient,
  ): Promise<R[]> {
    const { client: db, release } = await this.getClient(client);

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

      return rows;
    } finally {
      if (release) db.release();
    }
  }

  /** VERSIONING */

  private async handleVersioning(client: PoolClient, entry: VersionEntry<T>) {
    if (this.asyncVersioning) {
      logger.debug(
        `Queued async versioning`,
        {
          table: this.versionTableName,
          recordId: entry.recordId,
          operation: entry.operation,
        },
        "DB_VERSION_ASYNC",
      );
      await versionQueue.add("versioning", {
        table: this.versionTableName,
        entry,
      });

      logger.debug(
        `Writing version entry`,
        {
          table: this.versionTableName,
          recordId: entry.recordId,
          operation: entry.operation,
        },
        "DB_VERSION_SYNC",
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

/*

import { BaseRepository } from "@irt/database/postgres/BaseRepository";
import { withTransaction } from "@irt/database/postgres/transaction";

interface Project {
  id: number;
  name: string;
  status: string;
}

const projectRepo = new BaseRepository<Project>({
  tableName: "projects",
  versionTableName: "projects_version",
});

await projectRepo.create(
  { name: "Alpha", status: "OPEN" },
  { userId: "user_123" }
);

await withTransaction(async (tx) => {

  const project = await projectRepo.create(
    { name: "Mega Project", status: "OPEN" },
    { userId: "user_1" },
    tx
  );

  await projectRepo.update(
    project.id,
    { status: "ACTIVE" },
    { userId: "user_1" },
    tx
  );

});

*/
