import { traverseGraph } from "./traverseGraph.js";

/**
 * Retrieves all ancestor nodes of a given entity using BFS traversal.
 *
 * @param {Buffer|string} entityId - The starting entity ID.
 * @param {Object} [options] - Optional traversal parameters (see `traverseGraph` for details).
 * @param {Array<string>} [options.relationshipTypes] - Only follow edges of these types.
 * @param {Array<string>} [options.entityTypeFilter] - Only include entities of these types.
 * @param {number} [options.maxDepth] - Maximum traversal depth.
 * @param {number} [options.maxNodes] - Maximum number of nodes to traverse.
 * @returns {Promise<Array<Object>>} Array of ancestor nodes, each including node details and `distance` from the starting entity.
 */
export const getAncestors = async (entityId, options = {}) => {
  // Perform BFS traversal upwards (following incoming edges)
  const nodesMap = await traverseGraph(entityId, { ...options, upwards: true });

  // Convert Map values to array for easier consumption
  return Array.from(nodesMap.values());
};
