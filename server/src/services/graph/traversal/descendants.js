import { traverseGraph } from "./traverseGraph.js";

/**
 * Retrieves all descendant nodes of a given entity using BFS traversal.
 *
 * @param {Buffer|string} entityId - The starting entity ID.
 * @param {Object} [options] - Optional traversal parameters (see `traverseGraph` for details).
 * @param {Array<string>} [options.relationshipTypes] - Only follow edges of these types.
 * @param {Array<string>} [options.entityTypeFilter] - Only include entities of these types.
 * @param {number} [options.maxDepth] - Maximum traversal depth.
 * @param {number} [options.maxNodes] - Maximum number of nodes to traverse.
 * @returns {Promise<Array<Object>>} Array of descendant nodes, each including node details and `distance` from the starting entity.
 */
export const getDescendants = async (entityId, options = {}) => {
  // Perform BFS traversal downwards (following outgoing edges)
  const nodesMap = await traverseGraph(entityId, {
    ...options,
    upwards: false, // descend the graph
  });

  // Convert Map values to array for easy consumption
  return Array.from(nodesMap.values());
};
