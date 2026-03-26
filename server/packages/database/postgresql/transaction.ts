import { pool } from "./connection";
import { PoolClient } from "pg";

export async function withTransaction<T>(
  fn: (client: PoolClient) => Promise<T>,
  existingClient?: PoolClient,
): Promise<T> {
  const client = existingClient ?? (await pool.connect());
  const isOuter = !existingClient;

  try {
    if (isOuter) await client.query("BEGIN");

    const result = await fn(client);

    if (isOuter) await client.query("COMMIT");

    return result;
  } catch (err) {
    if (isOuter) await client.query("ROLLBACK");
    throw err;
  } finally {
    if (isOuter) client.release();
  }
}
