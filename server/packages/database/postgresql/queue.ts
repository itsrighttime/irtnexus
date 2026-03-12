import { Queue, Worker } from "bullmq";
import { pool } from "./connection";

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
