import { DatabaseFactory } from "#database";
import { extractRows, logger } from "#utils";

// Initialize database connection for user operations
const opUser = DatabaseFactory.userOp();

/**
 * Inserts a relationship between two entities into the database.
 *
 * @param {Object} params - The params to insert.
 * @param {string} params.id - Unique identifier for the relationship.
 * @param {string} params.fromId - ID of the source entity.
 * @param {string} params.toId - ID of the target entity.
 * @param {string} params.type - Type of relationship (e.g., "parent", "friend").
 * @param {Object} constraints - Optional constraints or metadata associated with the relationship.
 * @param {Object|null} conn - Optional database connection object to override the default.
 */
export async function insertRelationship(
  { id, fromId, toId, type, constraints },
  conn = null,
) {
  const db = conn ?? opUser;

  try {
    await db.query(
      `INSERT INTO entity_relationships
       (id, from_entity_id, to_entity_id, relationship_type, constraints)
       VALUES (?, ?, ?, ?, ?)`,
      [id, fromId, toId, type, JSON.stringify(constraints)],
    );

    logger.info("Inserted relationship", { id, fromId, toId, type });
  } catch (error) {
    logger.error({
      message: "Failed to insert relationship",
      context: { id, fromId, toId, type },
      error,
    });
    throw error; // rethrow to preserve behavior
  }
}

/**
 * Retrieves all relationships originating from a given entity.
 *
 * @param {string} fromId - ID of the entity to get outgoing relationships from.
 * @param {Object|null} conn - Optional database connection object to override the default.
 * @returns {Promise<Array>} List of relationship rows from the database.
 */
export async function getOutgoing(fromId, conn = null) {
  const db = conn ?? opUser;

  try {
    const result = await db.query(
      "SELECT * FROM entity_relationships WHERE from_entity_id = ?",
      [fromId],
    );

    const rows = extractRows(result);
    logger.info(`Fetched ${rows.length} outgoing relationships`, { fromId });
    return rows;
  } catch (error) {
    logger.error({
      message: "Failed to fetch outgoing relationships",
      context: { fromId },
      error,
    });
    throw error;
  }
}

/**
 * Retrieves all relationships targeting a given entity.
 *
 * @param {string} toId - ID of the entity to get incoming relationships for.
 * @param {Object|null} conn - Optional database connection object to override the default.
 * @returns {Promise<Array>} List of relationship rows from the database.
 */
export async function getIncoming(toId, conn = null) {
  const db = conn ?? opUser;

  try {
    const result = await db.query(
      "SELECT * FROM entity_relationships WHERE to_entity_id = ?",
      [toId],
    );

    const rows = extractRows(result);
    logger.info(`Fetched ${rows.length} incoming relationships`, { toId });
    return rows;
  } catch (error) {
    logger.error({
      message: "Failed to fetch incoming relationships",
      context: { toId },
      error,
    });
    throw error;
  }
}

/**
 * Retrieves all relationships connected to a given entity, both incoming and outgoing.
 *
 * @param {string} entityId - ID of the entity to find connections for.
 * @param {Object|null} conn - Optional database connection object to override the default.
 * @returns {Promise<Array>} List of connected relationships.
 */
export async function getConnected(entityId, conn = null) {
  const db = conn ?? opUser;

  try {
    const result = await db.query(
      `SELECT from_entity_id, to_entity_id, relationship_type
       FROM entity_relationships
       WHERE from_entity_id = ? OR to_entity_id = ?`,
      [entityId, entityId],
    );

    const rows = extractRows(result);
    logger.info(`Fetched ${rows.length} connected relationships`, { entityId });
    return rows;
  } catch (error) {
    logger.error({
      message: "Failed to fetch connected relationships",
      context: { entityId },
      error,
    });
    throw error;
  }
}

/**
 * Retrieves the parent entities of a given entity.
 *
 * @param {string} entityId - ID of the entity.
 * @param {Object|null} conn - Optional database connection object to override the default.
 * @returns {Promise<Array<string>>} List of parent entity IDs.
 */
export async function getParents(entityId, conn = null) {
  const db = conn ?? opUser;

  try {
    const result = await db.query(
      "SELECT from_entity_id AS id FROM entity_relationships WHERE to_entity_id = ?",
      [entityId],
    );

    const rows = extractRows(result);
    const parents = rows.map((r) => r.id);
    logger.info(`Fetched ${parents.length} parents`, { entityId });
    return parents;
  } catch (error) {
    logger.error({
      message: "Failed to fetch parents",
      context: { entityId },
      error,
    });
    throw error;
  }
}

/**
 * Retrieves the child entities of a given entity.
 *
 * @param {string} entityId - ID of the entity.
 * @param {Object|null} conn - Optional database connection object to override the default.
 * @returns {Promise<Array<string>>} List of child entity IDs.
 */
export async function getChildren(entityId, conn = null) {
  const db = conn ?? opUser;

  try {
    const result = await db.query(
      "SELECT to_entity_id AS id FROM entity_relationships WHERE from_entity_id = ?",
      [entityId],
    );

    const rows = extractRows(result);
    const children = rows.map((r) => r.id);
    logger.info(`Fetched ${children.length} children`, { entityId });
    return children;
  } catch (error) {
    logger.error({
      message: "Failed to fetch children",
      context: { entityId },
      error,
    });
    throw error;
  }
}

/**
 * Retrieves all outgoing edges (relationships) from a given entity.
 *
 * @param {string} entityId - ID of the source entity.
 * @param {Object|null} conn - Optional database connection object to override the default.
 * @returns {Promise<Array>} List of relationship rows.
 */
export async function getEdgesFrom(entityId, conn = null) {
  try {
    const rows = await getOutgoing(entityId, conn);
    logger.info(`Fetched ${rows.length} outgoing edges`, { entityId });
    return rows;
  } catch (error) {
    logger.error({
      message: "Failed to fetch edges from entity",
      context: { entityId },
      error,
    });
    throw error;
  }
}

/**
 * Retrieves the IDs of all entities that a given entity points to.
 *
 * @param {string} fromId - ID of the source entity.
 * @param {Object|null} conn - Optional database connection object to override the default.
 * @returns {Promise<Array<string>>} List of target entity IDs.
 */
export async function getOutgoingIds(fromId, conn = null) {
  const db = conn ?? opUser;

  try {
    const result = await db.query(
      "SELECT to_entity_id AS id FROM entity_relationships WHERE from_entity_id = ?",
      [fromId],
    );
    const rows = extractRows(result);
    const ids = rows.map((r) => r.id);
    logger.info(`Fetched ${ids.length} outgoing IDs`, { fromId });
    return ids;
  } catch (error) {
    logger.error({
      message: "Failed to fetch outgoing IDs",
      context: { fromId },
      error,
    });
    throw error;
  }
}

/**
 * Counts the number of incomming/outgoing edges of a specific type for a given entity.
 *
 * @param {Object} params - The params to insert.
 * @param {string} params.id - ID of the source entity.
 * @param {string} params.relationshipType - Type of relationship to count.
 * @param {boolean} params.isIncomming - Default - true .
 * @param {Object|null} conn - Optional database connection object to override the default.
 * @returns {Promise<number>} Number of outgoing edges of the specified type.
 */
export async function countEdges({ id, isIncomming = true }, conn = null) {
  const db = conn ?? opUser;
  const column = isIncomming ? "to_entity_id" : "from_entity_id";

  try {
    const result = await db.query(
      `SELECT COUNT(*) AS count FROM entity_relationships WHERE ${column} = ?`,
      [id],
    );
    const count = extractRows(result)[0]?.count ?? 0;
    logger.info(`Counted ${count} edges`, {
      id,
      direction: isIncomming ? "incoming" : "outgoing",
    });
    return count;
  } catch (error) {
    logger.error({
      message: "Failed to count edges",
      context: { id, isIncomming },
      error,
    });
    throw error;
  }
}

/**
 * Fetches the neighbors (connected entities) for a given entity based on its relationships in the database.
 *
 * @async
 * @param {Object} options - The options object.
 * @param {number|string} options.id - The ID of the entity for which to fetch neighbors.
 * @param {boolean} [options.upwards=false] - Whether to fetch neighbors in the "upwards" direction (true) or "downwards" (false).
 * @param {string[]} [options.relationshipTypes=[]] - A list of relationship types to filter the neighbors by. If empty, no filtering is applied.
 * @param {Object|null} [conn=null] - The database connection object. If not provided, the default connection `opUser` will be used.
 *
 * @returns {Promise<string[]>} - A promise that resolves to an array of neighbor IDs.
 *
 * @throws {Error} Will throw an error if the database query fails.
 */
export async function getNeighbors(
  { id, upwards = false, relationshipTypes = [] },
  conn = null,
) {
  const db = conn ?? opUser;
  const relationDir = upwards ? "to_entity_id" : "from_entity_id";
  const targetDir = upwards ? "from_entity_id" : "to_entity_id";

  const sql = `
    SELECT ${targetDir} AS neighborId
    FROM entity_relationships
    WHERE ${relationDir} = ?
    ${relationshipTypes.length ? `AND relationship_type IN (?)` : ""}
  `;
  const params = relationshipTypes.length ? [id, relationshipTypes] : [id];

  try {
    const result = await db.query(sql, params);
    const rows = extractRows(result);
    const neighborIds = rows.map((r) => r.neighborId);
    logger.info(`Fetched ${neighborIds.length} neighbors`, {
      id,
      upwards,
      relationshipTypes,
    });
    return neighborIds;
  } catch (error) {
    logger.error({
      message: "Failed to fetch neighbors",
      context: { id, upwards, relationshipTypes },
      error,
    });
    throw error;
  }
}

/**
 * Retrieves outgoing neighbors (entities that a given entity points to) optionally filtered by type.
 *
 * @param {Object} options - The options object.
 * @param {string} options.id - ID of the source entity.
 * @param {Array<string>} [options.relationshipTypes=[]] - Optional array of relationship types to filter by.
 * @param {Object|null} conn - Optional database connection object to override the default.
 * @returns {Promise<Array<string>>} List of neighbor entity IDs.
 */
export async function getOutgoingNeighbors(
  { id, relationshipTypes = [] },
  conn = null,
) {
  const db = conn ?? opUser;
  const sql = `
    SELECT to_entity_id AS neighborId
    FROM entity_relationships
    WHERE from_entity_id = ?
    ${relationshipTypes.length ? `AND relationship_type IN (?)` : ""}
  `;
  const params = relationshipTypes.length ? [id, relationshipTypes] : [id];

  try {
    const result = await db.query(sql, params);
    const rows = extractRows(result);
    const neighborIds = rows.map((r) => r.neighborId);
    logger.info(`Fetched ${neighborIds.length} outgoing neighbors`, {
      id,
      relationshipTypes,
    });
    return neighborIds;
  } catch (error) {
    logger.error({
      message: "Failed to fetch outgoing neighbors",
      context: { id, relationshipTypes },
      error,
    });
    throw error;
  }
}
/**
 * Fetches relationships between nodes from the database.
 *
 * @param {Object} options - The options object.
 * @param {Array<Buffer>} options.nodeIds - Array of node IDs.
 * @param {Array<string>} options.relationshipTypes - Optional filter for specific relationship types.
 * @param {Object|null} conn - Optional database connection object to override the default.
 * @returns {Promise<Array<Object>>} - List of relationships between nodes.
 */
export const getRelationships = async (
  { nodeIds, relationshipTypes = [] },
  conn = null,
) => {
  const db = conn ?? opUser;

  try {
    const result = await db.query(
      `
      SELECT 
        from_entity_id AS fromId, 
        to_entity_id AS toId, 
        relationship_type
      FROM entity_relationships
      WHERE from_entity_id IN (?) AND to_entity_id IN (?)
      ${relationshipTypes.length ? `AND relationship_type IN (?)` : ""}
      `,
      relationshipTypes.length
        ? [nodeIds, nodeIds, relationshipTypes]
        : [nodeIds, nodeIds],
    );

    const rows = extractRows(result);
    logger.info(`Fetched ${rows.length} relationships`, {
      nodeIds,
      relationshipTypes,
    });
    return rows;
  } catch (error) {
    logger.error({
      message: "Failed to fetch relationships",
      context: { nodeIds, relationshipTypes },
      error,
    });
    throw error;
  }
};

/**
 * Fetches relationships between nodes from the database.
 *
 * @param {Object} options - The options object.
 * @param {Array<Buffer>} options.fromId - Source (from) ID.
 * @param {Array<Buffer>} options.toId - Target (to) ID.
 * @param {Array<string>} options.relationshipTypes - relationship types.
 * @param {Object|null} conn - Optional database connection object to override the default.
 * @returns {Promise<Array<Object>>} - Relationships between nodes.
 */
export const getRelationship = async (
  { fromId, toId, relationshipType },
  conn = null,
) => {
  const db = conn ?? opUser;

  try {
    const result = await db.query(
      `
      SELECT 
        from_entity_id AS fromId, 
        to_entity_id AS toId, 
        relationship_type
      FROM entity_relationships
      WHERE 
        from_entity_id = ? AND
        to_entity_id = ? AND
        relationship_type = ?
      `,
      [fromId, toId, relationshipType],
    );

    const rows = extractRows(result);
    logger.info(`Fetched ${rows.length} relationship(s)`, {
      fromId,
      toId,
      relationshipType,
    });
    return rows;
  } catch (error) {
    logger.error({
      message: "Failed to fetch relationship",
      context: { fromId, toId, relationshipType },
      error,
    });
    throw error;
  }
};
