import { DatabaseFactory } from "#database";
import { hexToBinary, logger } from "#utils";

// Initialize database connection for user operations
const opDb = DatabaseFactory.userOp();

/**
 * Inserts a new entity into the database.
 *
 * @param {Object} entity - The entity to insert.
 * @param {string} entity.id - Unique identifier for the entity.
 * @param {string} entity.name - Name of the entity.
 * @param {string} entity.type - Type/category of the entity (e.g., "user", "group").
 * @param {Object} entity.metadata - Optional additional data associated with the entity.
 * @param {string} entity.status - Status of the entity (e.g., "active", "inactive").
 * @param {Object|null} conn - Optional database connection object to override the default.
 */
export async function insertEntity(
  { id, name, type, metadata, status },
  conn = null,
) {
  const db = conn ?? opDb;

  try {
    await db.query(
      "INSERT INTO entities (id, name, type, metadata, status) VALUES (?, ?, ?, ?, ?)",
      [id, name, type, JSON.stringify(metadata), status],
    );

    logger.info("Inserted entity", { id, name, type, status });
  } catch (error) {
    logger.error({
      message: "Failed to insert entity",
      context: { id, name, type, status },
      error,
    });
    throw error;
  }
}
/**
 * Retrieves a single entity by its ID.
 *
 * @param {string} id - ID of the entity to fetch.
 * @param {Object|null} conn - Optional database connection object to override the default.
 * @returns {Promise<Object|null>} The entity object if found, otherwise null.
 */
export async function getEntityById(id, conn = null) {
  const db = conn ?? opDb;

  try {
    const [rows] = await db.query("SELECT * FROM entities WHERE id = ?", [id]);
    const entity = rows?.[0] ?? null;
    logger.info(entity ? "Fetched entity by ID" : "Entity not found", { id });
    return entity;
  } catch (error) {
    logger.error({
      message: "Failed to fetch entity by ID",
      context: { id },
      error,
    });
    throw error;
  }
}
/**
 * Retrieves all entities of a specific type and status.
 *
 * @param {Object} params - The parameters for filtering entities.
 * @param {string} params.type - Type of entities to fetch.
 * @param {string} params.status - Status of entities to fetch (e.g., "active").
 * @param {Object|null} conn - Optional database connection object to override the default.
 * @returns {Promise<Array>} List of matching entity objects.
 */
export async function getEntitiesByType({ type, status }, conn = null) {
  const db = conn ?? opDb;

  try {
    const [rows] = await db.query(
      "SELECT * FROM entities WHERE type = ? AND status = ?",
      [type, status],
    );
    logger.info(`Fetched ${rows.length} entities`, { type, status });
    return rows;
  } catch (error) {
    logger.error({
      message: "Failed to fetch entities by type",
      context: { type, status },
      error,
    });
    throw error;
  }
}

/**
 * Updates the metadata of an entity.
 *
 * @param {Object} params - The entity and its metadata to update.
 * @param {string} params.id - ID of the entity to update.
 * @param {Object} params.metadata - New metadata object.
 * @param {Object|null} conn - Optional database connection object to override the default.
 */
export async function updateEntityMetadata({ id, metadata }, conn = null) {
  const db = conn ?? opDb;

  try {
    await db.query(
      "UPDATE entities SET metadata = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [JSON.stringify(metadata), id],
    );
    logger.info("Updated entity metadata", { id });
  } catch (error) {
    logger.error({
      message: "Failed to update entity metadata",
      context: { id },
      error,
    });
    throw error;
  }
}

/**
 * Updates the specified fields of an entity.
 *
 * Only updates fields that are provided.
 *
 * @param {Object} params
 * @param {string} params.id - ID of the entity to update.
 * @param {string} [params.name] - New name of the entity.
 * @param {Object} [params.metadata] - New metadata object.
 * @param {string} [params.status] - New status of the entity.
 * @param {Object|null} conn - Optional database connection object.
 */
export async function updateEntity(
  { id, name, metadata, status },
  conn = null,
) {
  const db = conn ?? opDb;

  const fields = [];
  const values = [];

  if (name !== undefined) {
    fields.push("name = ?");
    values.push(name);
  }
  if (metadata !== undefined) {
    fields.push("metadata = ?");
    values.push(JSON.stringify(metadata));
  }
  if (status !== undefined) {
    fields.push("status = ?");
    values.push(status);
  }

  if (fields.length === 0) return; // Nothing to update

  fields.push("updated_at = CURRENT_TIMESTAMP");
  values.push(hexToBinary(id));

  try {
    const result = await db.query(
      `UPDATE entities SET ${fields.join(", ")} WHERE id = ?`,
      values,
    );
    logger.info("Updated entity", {
      id,
      fields: Object.keys({ name, metadata, status }).filter(
        (k) => k !== undefined,
      ),
    });
    return result;
  } catch (error) {
    logger.error({
      message: "Failed to update entity",
      context: { id },
      error,
    });
    throw error;
  }
}

/**
 * Deactivates an entity by setting its status to 'inactive'.
 *
 * @param {string} id - ID of the entity to deactivate.
 * @param {Object|null} conn - Optional database connection object to override the default.
 */
export async function deactivateEntity(id, conn = null) {
  const db = conn ?? opDb;

  try {
    await db.query(
      "UPDATE entities SET status = 'inactive', updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [id],
    );
    logger.info("Deactivated entity", { id });
  } catch (error) {
    logger.error({
      message: "Failed to deactivate entity",
      context: { id },
      error,
    });
    throw error;
  }
}

/**
 * Retrieves the IDs of all entities in the database.
 *
 * @param {Object|null} conn - Optional database connection object to override the default.
 * @returns {Promise<Array<string>>} List of entity IDs.
 */
export async function getAllEntityIds(conn = null) {
  const db = conn ?? opDb;

  try {
    const [rows] = await db.query("SELECT id FROM entities");
    const ids = rows.map((r) => r.id);
    logger.info(`Fetched ${ids.length} entity IDs`);
    return ids;
  } catch (error) {
    logger.error({ message: "Failed to fetch all entity IDs", error });
    throw error;
  }
}

/**
 * Retrieves the type of a specific entity by ID.
 *
 * @param {string} id - ID of the entity.
 * @param {Object|null} conn - Optional database connection object to override the default.
 * @returns {Promise<string|null>} The entity type, or null if not found.
 */
export async function getEntityType(id, conn = null) {
  const db = conn ?? opDb;

  try {
    const [rows] = await db.query("SELECT type FROM entities WHERE id = ?", [
      id,
    ]);
    const type = rows?.[0]?.type ?? null;
    logger.info(type ? "Fetched entity type" : "Entity type not found", { id });
    return type;
  } catch (error) {
    logger.error({
      message: "Failed to fetch entity type",
      context: { id },
      error,
    });
    throw error;
  }
}
