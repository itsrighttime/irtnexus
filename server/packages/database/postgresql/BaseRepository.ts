import { PoolClient, QueryResultRow } from "pg";
import { pool } from "./connection";
import { versionQueue } from "./queue";
import { BaseRepositoryOptions, VersionEntry, RequestContext } from "./types";
import { QuerySecurityEngine } from "./QuerySecurityEngine";

export class BaseRepository<T extends QueryResultRow> {
  protected tableName: string;
  protected versionTableName: string;
  protected asyncVersioning: boolean;

  constructor(options: BaseRepositoryOptions) {
    this.tableName = options.tableName;
    this.versionTableName = options.versionTableName;
    this.asyncVersioning = options.asyncVersioning ?? false;
  }

  private async getClient(client?: PoolClient) {
    if (client) return { client, release: false };

    const newClient = await pool.connect();

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
      if (release) await db.query("BEGIN");

      const fields = Object.keys(record).join(", ");
      const values = Object.values(record);
      const placeholders = values.map((_, i) => `$${i + 1}`).join(", ");

      const query = `
        INSERT INTO ${this.tableName}
        (${fields})
        VALUES (${placeholders})
        RETURNING *
      `;

      const { rows } = await db.query<T>(query, values);

      const created = rows[0];

      await this.handleVersioning(db, {
        recordId: (created as any).id,
        data: created,
        operation: "CREATE",
        performedBy: ctx.userId,
        performedAt: new Date(),
      });

      if (release) await db.query("COMMIT");

      return created;
    } catch (err) {
      if (release) await db.query("ROLLBACK");
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
      if (release) await db.query("BEGIN");

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

      if (release) await db.query("COMMIT");

      return updated;
    } catch (err) {
      if (release) await db.query("ROLLBACK");
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
      if (release) await db.query("BEGIN");

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

      if (release) await db.query("COMMIT");
    } catch (err) {
      if (release) await db.query("ROLLBACK");
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

      const { rows } = await db.query<R>(finalSql, params);

      return rows;
    } finally {
      if (release) db.release();
    }
  }

  /** VERSIONING */

  private async handleVersioning(client: PoolClient, entry: VersionEntry<T>) {
    if (this.asyncVersioning) {
      await versionQueue.add("versioning", {
        table: this.versionTableName,
        entry,
      });

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
