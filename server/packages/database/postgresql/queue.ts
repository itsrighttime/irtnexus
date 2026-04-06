import { Queue, Worker } from "bullmq";
import { pool } from "./connection";
import { logger } from "#utils";

const redisConnection = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT || 6379),
};

export const versionQueue = new Queue("versioning", {
  connection: redisConnection,
});

export const versionWorker = new Worker(
  "versioning",
  async (job) => {
    const { table, entry } = job.data;

    const client = await pool.connect();

    try {
      const fields = Object.keys(entry.data).join(", ");
      const values = Object.values(entry.data);
      const placeholders = values.map((_, i) => `$${i + 1}`).join(", ");

      const query = `
        INSERT INTO ${table}
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
    } finally {
      client.release();
    }
  },
  { connection: redisConnection },
);

// Queue for async writes
export const writeQueue = new Queue("writeQueue", {
  connection: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

// Worker that processes queued writes
export const writeWorker = new Worker(
  "writeQueue",
  async (job) => {
    const { table, data, id, updates, context } = job.data;
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      if (job.name === "insertRecord") {
        const fields = Object.keys(data).join(", ");
        const values = Object.values(data);
        const placeholders = values.map((_, i) => `$${i + 1}`).join(", ");

        await client.query(
          `INSERT INTO ${table} (${fields}) VALUES (${placeholders}) ON CONFLICT DO NOTHING`,
          values,
        );
      } else if (job.name === "updateRecord") {
        const setClauses = Object.keys(updates)
          .map((key, i) => `${key}=$${i + 1}`)
          .join(", ");
        const values = Object.values(updates);
        values.push(id);

        await client.query(
          `UPDATE ${table} SET ${setClauses}, updated_at=NOW() WHERE id=$${values.length}`,
          values,
        );
      } else if (job.name === "deleteRecord") {
        await client.query(
          `UPDATE ${table} SET deleted_at=NOW(), deleted_by=$2 WHERE id=$1`,
          [id, context.userId],
        );
      }

      await client.query("COMMIT");
      logger.info(`Async job completed`, { jobName: job.name, table, id });
    } catch (err: any) {
      await client.query("ROLLBACK");
      logger.error(`Async job failed`, err);
      throw err;
    } finally {
      client.release();
    }
  },
  {
    connection: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    },
    concurrency: 5, // number of parallel jobs
  },
);

writeWorker.on("failed", (job: any, err: any) => {
  logger.error(`Job failed`, { jobId: job.id, jobName: job.name, err });
});
