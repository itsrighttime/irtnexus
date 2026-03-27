import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { PoolClient } from "pg";
import { logger } from "#utils";
import { DB_SETUP_HELPERS } from ".";

const { DATABASES_TABLE_FOLDERS, pgPool } = DB_SETUP_HELPERS;
const SEED_TABLE = "_seeds";

/**
 * Ensure seed tracking table exists
 */
async function ensureSeedTable(client: PoolClient) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS ${SEED_TABLE} (
      id SERIAL PRIMARY KEY,
      db_name VARCHAR(255),
      file_name VARCHAR(255),
      executed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (db_name, file_name)
    );
  `);
}

/**
 * Check if seed already ran
 */
async function isSeedExecuted(
  client: PoolClient,
  dbName: string,
  fileName: string,
): Promise<boolean> {
  const res = await client.query(
    `SELECT 1 FROM ${SEED_TABLE} WHERE db_name = $1 AND file_name = $2`,
    [dbName, fileName],
  );
  return (res.rowCount ?? 0) > 0; // null-safe
}

/**
 * Record executed seed
 */
async function recordSeed(
  client: PoolClient,
  dbName: string,
  fileName: string,
) {
  await client.query(
    `INSERT INTO ${SEED_TABLE} (db_name, file_name) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
    [dbName, fileName],
  );
}

/**
 * Execute seed files
 */
async function executeSeeds(
  client: PoolClient,
  dbName: string,
  folders: string[],
  mode: string,
) {
  await ensureSeedTable(client);

  for (const folder of folders) {
    const folderPath = path.resolve(`scripts/database/postgresql/seed/${folder}`);
    if (!fs.existsSync(folderPath)) continue;

    const seedFiles = fs
      .readdirSync(folderPath)
      .filter((f) => f.endsWith(".ts"))
      .sort();

    logger.info(`Found ${seedFiles.length} seed files in '${folder}'`);

    for (const file of seedFiles) {
      if (mode === "--soft" && (await isSeedExecuted(client, dbName, file))) {
        logger.info(`Skipping seed (already executed): ${file}`);
        continue;
      }

      const seedPath = path.join(folderPath, file);
      const seedUrl = pathToFileURL(seedPath).href;
      const seedFn = (await import(seedUrl)).default;

      if (typeof seedFn !== "function") {
        logger.warn(`Skipping ${file}: no default export`);
        continue;
      }

      logger.info(`Running seed: ${file}`);

      try {
        await client.query("BEGIN");
        await seedFn(client);
        await recordSeed(client, dbName, file);
        await client.query("COMMIT");
        logger.info(`Seed completed: ${file}`);
      } catch (err: any) {
        await client.query("ROLLBACK");
        logger.error(`Seed failed: ${file}`, err);
        process.exit(1);
      }
    }
  }
}

/**
 * Main seeding runner
 */
async function runSeeds(mode: "--soft" | "--hard" = "--soft") {
  if (!["--soft", "--hard"].includes(mode)) {
    logger.error("Invalid seed mode. Use '--soft' or '--hard'.");
    process.exit(1);
  }

  const client = await pgPool.connect();
  logger.info("Connected to PostgreSQL server for seeding");
  logger.info(`Seed mode: ${mode.toUpperCase()}`);

  for (const { name: dbName, folders } of DATABASES_TABLE_FOLDERS) {
    logger.info("##########################################");
    logger.info(`=== Seeding database: ${dbName} ===`);

    if (mode === "--hard") {
      logger.warn("Hard mode: seeds will re-run even if previously executed");
    }

    await executeSeeds(client, dbName, folders, mode);
  }

  logger.info("##########################################");
  logger.info("All seeds completed successfully!");
  client.release();
  process.exit(0);
}

const modeArg = (process.argv[2] as "--soft" | "--hard") || "--soft";
runSeeds(modeArg).catch((err) => {
  logger.error("Seeding failed:", err);
  process.exit(1);
});
