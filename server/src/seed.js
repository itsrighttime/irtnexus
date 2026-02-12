import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { pool, DATABASES_TABLE_FOLDERS } from "#config";
import { logger } from "#utils";
import { pathToFileURL } from "url";

const SEED_TABLE = "_seeds";

/**
 * Ensure seed tracking table exists
 */
async function ensureSeedTable(connection) {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS \`${SEED_TABLE}\` (
      id INT AUTO_INCREMENT PRIMARY KEY,
      db_name VARCHAR(255),
      file_name VARCHAR(255),
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_seed (db_name, file_name)
    );
  `);
}

/**
 * Check if seed already ran
 */
async function isSeedExecuted(connection, dbName, fileName) {
  const [rows] = await connection.query(
    `SELECT 1 FROM \`${SEED_TABLE}\` WHERE db_name = ? AND file_name = ?`,
    [dbName, fileName],
  );
  return rows.length > 0;
}

/**
 * Record executed seed
 */
async function recordSeed(connection, dbName, fileName) {
  await connection.query(
    `INSERT INTO \`${SEED_TABLE}\` (db_name, file_name) VALUES (?, ?)`,
    [dbName, fileName],
  );
}

/**
 * Execute seed files
 */
async function executeSeeds(connection, dbName, folders, mode) {
  await connection.query(`USE \`${dbName}\`;`);
  await ensureSeedTable(connection);

  for (const folder of folders) {
    const folderPath = path.resolve(`src/database/seed/${folder}`);

    if (!fs.existsSync(folderPath)) continue;

    const seedFiles = fs
      .readdirSync(folderPath)
      .filter((f) => f.endsWith(".js"))
      .sort();

    logger.info(`Found ${seedFiles.length} seed files in '${folder}'`);

    for (const file of seedFiles) {
      if (
        mode === "--soft" &&
        (await isSeedExecuted(connection, dbName, file))
      ) {
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
        await connection.beginTransaction();
        await seedFn(connection);
        await recordSeed(connection, dbName, file);
        await connection.commit();
        logger.info(`Seed completed: ${file}`);
      } catch (err) {
        await connection.rollback();
        logger.error(`Seed failed: ${file}`);
        logger.error(err.message);
        logger.error(err);
        process.exit(1);
      }
    }
  }
}

/**
 * Main seeding runner
 */
async function runSeeds(mode = "--soft") {
  if (!["--soft", "--hard"].includes(mode)) {
    logger.error("Invalid seed mode. Use '--soft' or '--hard'.");
    process.exit(1);
  }

  const connection = await pool.getConnection();
  logger.info("Connected to MySQL server for seeding");
  logger.info(`Seed mode: ${mode.toUpperCase()}`);

  for (const { name: dbName, folders } of DATABASES_TABLE_FOLDERS) {
    logger.info("##########################################");
    logger.info(`=== Seeding database: ${dbName} ===`);

    if (mode === "--hard") {
      logger.warn("Hard mode: seeds will re-run even if previously executed");
    }

    await executeSeeds(connection, dbName, folders, mode);
  }

  logger.info("##########################################");
  logger.info("All seeds completed successfully!");
  connection.release();
  process.exit(0);
}

const modeArg = process.argv[2] || "--soft";
runSeeds(modeArg).catch((err) => {
  logger.error("Seeding failed:");
  logger.error(err);
  process.exit(1);
});
