import { entityQuery, entityRelationshipQuery as ERQ } from "#queries";
import { SYSTEM_LIMITS } from "../config/systemLimits.js";

/**
 * Performs a generic breadth-first search (BFS) traversal of the entity graph.
 *
 * Can filter by relationship type, entity type, traversal direction, maximum depth,
 * and maximum number of nodes visited. Returns a Map of visited nodes keyed by entity ID (hex string).
 *
 * @param {Buffer|string} startId - The starting entity ID for traversal.
 * @param {Object} [options] - Optional parameters for traversal.
 * @param {Array<string>} [options.relationshipTypes=[]] - Only traverse relationships of these types.
 * @param {Array<string>} [options.entityTypeFilter=[]] - Only include entities of these types in the results.
 * @param {number} [options.maxDepth=SYSTEM_LIMITS.graph.maxTraversalDepth] - Maximum traversal depth.
 * @param {number} [options.maxNodes=SYSTEM_LIMITS.graph.maxNodes] - Maximum number of nodes to visit.
 * @param {boolean} [options.upwards=false] - If true, traverse incoming edges; otherwise, traverse outgoing edges.
 * @returns {Promise<Map<string, Object>>} A Map where keys are entity IDs in hex format, and values are node objects with additional `distance` property.
 */
export const traverseGraph = async (startId, options = {}) => {
  const {
    relationshipTypes = [],
    entityTypeFilter = [],
    maxDepth = SYSTEM_LIMITS.graph.maxTraversalDepth,
    maxNodes = SYSTEM_LIMITS.graph.maxNodes,
    upwards = false,
  } = options;

  const visited = new Map(); // key = id.toString('hex'), value = node object with distance
  const queue = [{ id: startId, distance: 0 }]; // BFS queue with distance tracking

  while (queue.length > 0) {
    const current = queue.shift();
    const hex = current.id.toString("hex");

    // Skip already visited nodes or stop if max nodes reached
    if (visited.has(hex) || visited.size >= maxNodes) continue;

    // Stop traversal if current distance exceeds maxDepth
    if (current.distance > maxDepth) break;

    // Fetch node details from DB
    const node = await entityQuery.getEntityById(current.id);
    if (!node) continue;

    // Apply entity type filter
    if (entityTypeFilter.length && !entityTypeFilter.includes(node.type))
      continue;

    // Record node with distance
    visited.set(hex, { ...node, distance: current.distance });

    // Fetch neighbors (outgoing or incoming based on 'upwards')
    const neighbors = await ERQ.getNeighbors(
      current.id,
      upwards,
      relationshipTypes,
    );

    // Enqueue neighbors with updated distance
    for (const neighborId of neighbors) {
      queue.push({ id: neighborId, distance: current.distance + 1 });
    }
  }

  return visited;
};
