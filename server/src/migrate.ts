import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { PoolClient } from "pg";
import {
  DATABASES_TABLE_FOLDERS,
  syncDropUsers,
  syncUsers,
  defaultPool,
  pgPool,
} from "#database";
import { logger } from "#utils";

const MIGRATION_TABLE = "_migrations"; // Tracks executed files

/**
 * Backup a PostgreSQL database to a SQL file
 */
async function backupDatabase(dbName: string): Promise<string> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupFile = `./backups/${dbName}_${timestamp}.sql`;

  fs.mkdirSync("./backups", { recursive: true });

  logger.info(`Backing up database '${dbName}' → ${backupFile}`);
  try {
    execSync(
      `pg_dump -U ${process.env.DB_USER} -h ${process.env.DB_HOST} -p ${process.env.DB_PORT || 5432} -F c ${dbName} -f ${backupFile}`,
      { stdio: "inherit", env: process.env },
    );
    logger.info(`Backup completed: ${backupFile}`);
  } catch (err: any) {
    logger.error("Backup failed:", err);
    process.exit(1);
  }

  return backupFile;
}

/**
 * Ensure migration tracking table exists
 */
async function ensureMigrationTable(client: PoolClient) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS ${MIGRATION_TABLE} (
      id SERIAL PRIMARY KEY,
      db_name VARCHAR(255),
      file_name VARCHAR(255),
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (db_name, file_name)
    );
  `);
}

/**
 * Check if a file was already executed
 */
async function isExecuted(
  client: PoolClient,
  dbName: string,
  fileName: string,
): Promise<boolean> {
  const res = await client.query(
    `SELECT 1 FROM ${MIGRATION_TABLE} WHERE db_name = $1 AND file_name = $2`,
    [dbName, fileName],
  );
  return (res.rowCount ?? 0) > 0;
}

/**
 * Record executed migration
 */
async function recordMigration(
  client: PoolClient,
  dbName: string,
  fileName: string,
) {
  await client.query(
    `INSERT INTO ${MIGRATION_TABLE} (db_name, file_name) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
    [dbName, fileName],
  );
}

/**
 * Execute migration files
 */
async function executeMigrations(
  client: PoolClient,
  dbName: string,
  folders: string[],
  mode: string,
) {
  await client.query(`SET search_path TO public;`);
  await ensureMigrationTable(client);

  for (const folder of folders) {
    const folderPath = path.resolve(`src/database/migrate/${folder}`);
    const sqlFiles = fs
      .readdirSync(folderPath)
      .filter((f) => f.endsWith(".sql"))
      .sort();

    logger.info(`Found ${sqlFiles.length} files in folder '${folder}'`);

    for (const file of sqlFiles) {
      if (mode === "--soft" && (await isExecuted(client, dbName, file))) {
        logger.info(`Skipping already executed file: ${file}`);
        continue;
      }

      const sql = fs.readFileSync(path.join(folderPath, file), "utf8");
      logger.info(`Executing: ${file}`);

      try {
        await client.query(sql);
        logger.info(`Executed: ${file}`);
        await recordMigration(client, dbName, file);
      } catch (err: any) {
        logger.error(`Error executing ${file}: ${err.message}`);
        process.exit(1);
      }
    }
  }
}

/**
 * Main migration runner
 */
async function runMigrations(mode: "--soft" | "--hard" = "--soft") {
  if (!["--soft", "--hard"].includes(mode)) {
    logger.error("Invalid migration mode. Use '--soft' or '--hard'.");
    process.exit(1);
  }

  const client = await pgPool.connect();
  const defaultClient = await defaultPool.connect();
  logger.info("Connected to PostgreSQL server");
  logger.info(`Migration mode: ${mode.toUpperCase()}`);

  for (const { name: dbName, folders } of DATABASES_TABLE_FOLDERS) {
    logger.info("##########################################");
    logger.info(`=== Migrating database: ${dbName} ===`);

    if (mode === "--hard") {
      await backupDatabase(dbName);

      // Drop users and database
      logger.info(`Dropping Users...`);
      await syncDropUsers();

      logger.info(`Dropping database '${dbName}'...`);
      await defaultClient.query(`DROP DATABASE IF EXISTS "${dbName}";`);

      logger.info(`Creating database '${dbName}'...`);
      await defaultClient.query(`CREATE DATABASE "${dbName}";`);
    } else {
      // Soft mode backup is optional
      await backupDatabase(dbName);
    }

    // Connect to the target database to run migrations
    const dbClient = await pgPool.connect();
    await executeMigrations(dbClient, dbName, folders, mode);
    dbClient.release();

    logger.info("Syncing database users...");
    await syncUsers();
  }

  logger.info("##########################################");
  logger.info("All migrations completed successfully!");
  client.release();
  process.exit(0);
}

// Accept migration mode via command line argument
const modeArg = (process.argv[2] as "--soft" | "--hard") || "--soft";
runMigrations(modeArg).catch((err) => {
  logger.error("Migration failed:", err);

  process.exit(1);
});
