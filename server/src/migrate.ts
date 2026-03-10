import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { Pool, PoolClient } from "pg";
import { DATABASES_TABLE_FOLDERS, syncUsers, DB_MAIN_CONFIG } from "#database";
import { logger } from "#utils";

const MIGRATION_TABLE = "_migrations";

/*
|--------------------------------------------------------------------------
| Pools
|--------------------------------------------------------------------------
*/

const adminPool = new Pool({
  ...DB_MAIN_CONFIG,
  database: "postgres", // IMPORTANT: admin DB
});

/*
|--------------------------------------------------------------------------
| Backup
|--------------------------------------------------------------------------
*/

async function backupDatabase(dbName: string): Promise<string> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupFile = `./backups/${dbName}_${timestamp}.sql`;

  fs.mkdirSync("./backups", { recursive: true });

  logger.info(`Backing up '${dbName}' → ${backupFile}`);

  execSync(
    `pg_dump -U ${process.env.DB_USER} -h ${process.env.DB_HOST} -p ${process.env.DB_PORT || 5432} -F c ${dbName} -f ${backupFile}`,
    { stdio: "inherit", env: process.env },
  );

  return backupFile;
}

/*
|--------------------------------------------------------------------------
| Migration table
|--------------------------------------------------------------------------
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

async function isExecuted(
  client: PoolClient,
  dbName: string,
  fileName: string,
): Promise<boolean> {
  const res = await client.query(
    `SELECT 1 FROM ${MIGRATION_TABLE} WHERE db_name=$1 AND file_name=$2`,
    [dbName, fileName],
  );

  return (res.rowCount ?? 0) > 0;
}

async function recordMigration(
  client: PoolClient,
  dbName: string,
  fileName: string,
) {
  await client.query(
    `INSERT INTO ${MIGRATION_TABLE} (db_name, file_name)
     VALUES ($1,$2)
     ON CONFLICT DO NOTHING`,
    [dbName, fileName],
  );
}

/*
|--------------------------------------------------------------------------
| Execute SQL files
|--------------------------------------------------------------------------
*/

async function executeMigrations(
  client: PoolClient,
  dbName: string,
  folders: string[],
  mode: "--soft" | "--hard",
) {
  await client.query(`SET search_path TO public`);
  await ensureMigrationTable(client);

  for (const folder of folders) {
    const folderPath = path.resolve(`src/database/migrate/${folder}`);

    const sqlFiles = fs
      .readdirSync(folderPath)
      .filter((f) => f.endsWith(".sql"))
      .sort();

    logger.info(`Found ${sqlFiles.length} files in '${folder}'`);

    for (const file of sqlFiles) {
      if (mode === "--soft" && (await isExecuted(client, dbName, file))) {
        logger.info(`Skipping executed: ${file}`);
        continue;
      }

      const sql = fs.readFileSync(path.join(folderPath, file), "utf8");

      try {
        logger.info(`Executing ${file}`);
        await client.query(sql);
        await recordMigration(client, dbName, file);
      } catch (err: any) {
        logger.error(`Migration failed in ${file}`, err);
        process.exit(1);
      }
    }
  }
}

/*
|--------------------------------------------------------------------------
| Hard reset database (Postgres-safe)
|--------------------------------------------------------------------------
*/

async function recreateDatabase(dbName: string) {
  const adminClient = await adminPool.connect();

  try {
    logger.info(`Terminating active connections for '${dbName}'`);

    await adminClient.query(
      `
      SELECT pg_terminate_backend(pid)
      FROM pg_stat_activity
      WHERE datname = $1
      AND pid <> pg_backend_pid()
      `,
      [dbName],
    );

    logger.warn(`Dropping database '${dbName}'`);
    await adminClient.query(`DROP DATABASE IF EXISTS "${dbName}"`);

    logger.info(`Creating database '${dbName}'`);
    await adminClient.query(`CREATE DATABASE "${dbName}"`);
  } finally {
    adminClient.release();
  }
}

/*
|--------------------------------------------------------------------------
| Main runner
|--------------------------------------------------------------------------
*/

async function runMigrations(mode: "--soft" | "--hard" = "--soft") {
  if (!["--soft", "--hard"].includes(mode)) {
    logger.error("Invalid mode. Use --soft or --hard");
    process.exit(1);
  }

  logger.info(`Migration mode: ${mode}`);

  for (const { name: dbName, folders } of DATABASES_TABLE_FOLDERS) {
    logger.info("====================================");
    logger.info(`Migrating database: ${dbName}`);

    await backupDatabase(dbName);

    if (mode === "--hard") {
      await recreateDatabase(dbName);
    }

    /*
    |--------------------------------------------------------------------------
    | Connect to target DB
    |--------------------------------------------------------------------------
    */

    const dbPool = new Pool({
      ...DB_MAIN_CONFIG,
      database: dbName,
    });

    const client = await dbPool.connect();

    try {
      await executeMigrations(client, dbName, folders, mode);
    } finally {
      client.release();
      await dbPool.end();
    }

    /*
    |--------------------------------------------------------------------------
    | Recreate users and privileges
    |--------------------------------------------------------------------------
    */

    logger.info("Syncing users and privileges...");
    await syncUsers();
  }

  logger.info("====================================");
  logger.info("All migrations completed");

  process.exit(0);
}

/*
|--------------------------------------------------------------------------
| CLI
|--------------------------------------------------------------------------
*/

const modeArg = (process.argv[2] as "--soft" | "--hard") || "--soft";

runMigrations(modeArg).catch((err) => {
  logger.error("Migration failed", err);
  process.exit(1);
});
