import fs from "fs";
import path from "path";
import { DATABASES_TABLE_FOLDERS, pool } from "#config";
import { syncDropUsers, syncUsers } from "#database";
import { execSync } from "child_process";
import { logger } from "#utils";

const MIGRATION_TABLE = "_migrations"; // Tracks executed files

/**
 * Backup a database to a SQL file
 */
async function backupDatabase(dbName) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupFile = `./backups/${dbName}_${timestamp}.sql`;

  fs.mkdirSync("./backups", { recursive: true });

  logger.info(`Backing up database '${dbName}' → ${backupFile}`);
  try {
    execSync(
      `mysqldump -u${process.env.DB_USER} -p${process.env.DB_PASS} ${dbName} > ${backupFile}`,
    );
    logger.info(`Backup completed: ${backupFile}`);
  } catch (err) {
    logger.error("Backup failed:");
    logger.error(err);
    process.exit(1);
  }
  return backupFile;
}

/**
 * Ensure migration tracking table exists
 */
async function ensureMigrationTable(connection) {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS \`${MIGRATION_TABLE}\` (
      id INT AUTO_INCREMENT PRIMARY KEY,
      db_name VARCHAR(255),
      file_name VARCHAR(255),
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_file (db_name, file_name)
    );
  `);
}

/**
 * Check if a file was already executed
 */
async function isExecuted(connection, dbName, fileName) {
  const [rows] = await connection.query(
    `SELECT 1 FROM \`${MIGRATION_TABLE}\` WHERE db_name = ? AND file_name = ?`,
    [dbName, fileName],
  );
  return rows.length > 0;
}

/**
 * Record executed migration
 */
async function recordMigration(connection, dbName, fileName) {
  await connection.query(
    `INSERT INTO \`${MIGRATION_TABLE}\` (db_name, file_name) VALUES (?, ?)`,
    [dbName, fileName],
  );
}

/**
 * Execute migration files
 */
async function executeMigrations(connection, dbName, folders, mode) {
  await connection.query(`USE \`${dbName}\`;`);
  await ensureMigrationTable(connection);

  for (const folder of folders) {
    const folderPath = path.resolve(`src/database/migrate/${folder}`);
    const sqlFiles = fs
      .readdirSync(folderPath)
      .filter((f) => f.endsWith(".sql"))
      .sort();

    logger.info(`Found ${sqlFiles.length} files in folder '${folder}'`);

    for (const file of sqlFiles) {
      if (mode === "--soft" && (await isExecuted(connection, dbName, file))) {
        logger.info(`Skipping already executed file: ${file}`);
        continue;
      }

      const sql = fs.readFileSync(path.join(folderPath, file), "utf8");
      logger.info(`Executing: ${file}`);

      try {
        await connection.query(sql);
        logger.info(`Executed: ${file}`);
        await recordMigration(connection, dbName, file);
      } catch (err) {
        logger.error(`Error executing ${file}: ${err.message}`);
        logger.error(err);
        process.exit(1);
      }
    }
  }
}

/**
 * Main migration runner
 * @param {string} mode "--hard" or "--soft"
 */
async function runMigrations(mode = "--soft") {
  if (!["--soft", "--hard"].includes(mode)) {
    logger.error("Invalid migration mode. Use '--soft' or '--hard'.");
    process.exit(1);
  }

  const connection = await pool.getConnection();
  logger.info("Connected to MySQL server");
  logger.info(`Migration mode: ${mode.toUpperCase()}`);

  for (const { name: dbName, folders } of DATABASES_TABLE_FOLDERS) {
    logger.info("##########################################");
    logger.info(`=== Migrating database: ${dbName} ===`);

    if (mode === "--hard") {
      // Backup before dropping
      await backupDatabase(dbName);

      // Drop users and database
      logger.info(`Dropping Users...`);
      await syncDropUsers();

      logger.info(`Dropping database '${dbName}'...`);
      await connection.query(`DROP DATABASE IF EXISTS \`${dbName}\`;`);

      // Create database
      logger.info(`Creating database '${dbName}'...`);
      await connection.query(`CREATE DATABASE \`${dbName}\`;`);
    } else {
      // Soft mode: backup is optional, can skip if desired
      await backupDatabase(dbName);
    }

    // Execute migrations
    await executeMigrations(connection, dbName, folders, mode);

    // Sync all users
    logger.info("Syncing database users...");
    await syncUsers();
  }

  logger.info("##########################################");
  logger.info("All migrations completed successfully!");
  connection.release();
  process.exit(0);
}

// Accept migration mode via command line argument
// e.g., `node migrate.js --hard` or `node migrate.js --soft`
const modeArg = process.argv[2] || "--soft";
runMigrations(modeArg).catch((err) => {
  logger.error("Migration failed:");
  logger.error(err);
  process.exit(1);
});
