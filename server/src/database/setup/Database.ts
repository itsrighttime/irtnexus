import { Pool, PoolClient, QueryResultRow } from "pg";

export class Database {
  constructor(private pool: Pool) {}

  async query<T extends QueryResultRow = QueryResultRow>(
    sql: string,
    params: any,
  ): Promise<T[]> {
    const result = await this.pool.query<T>(sql, params);
    return result.rows;
  }

  async execute(sql: string, params: any) {
    const result = await this.pool.query(sql, params);
    return result;
  }

  async transaction<T>(
    callback: (client: PoolClient) => Promise<T>,
  ): Promise<T> {
    const client = await this.pool.connect();

    try {
      await client.query("BEGIN");

      const result = await callback(client);

      await client.query("COMMIT");

      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}
