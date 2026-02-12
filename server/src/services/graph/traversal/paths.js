import { entityRelationshipQuery as ERQ } from "#queries";

/**
 * Finds all paths from a source entity to a target entity using BFS.
 *
 * Useful for discovering multiple routes between entities in the graph.
 *
 * @param {Buffer} fromId - The source entity ID.
 * @param {Buffer} toId - The target entity ID.
 * @param {Object} [options] - Optional parameters to control traversal.
 * @param {Array<string>} [options.relationshipTypes=[]] - Only follow edges of these types.
 * @param {number} [options.maxDepth=5] - Maximum length of paths (number of edges).
 * @param {number} [options.maxPaths=100] - Maximum number of paths to find.
 * @returns {Promise<Array<Array<Object>>>} Array of paths, each path is an array of node objects (full node data) from source to target.
 */
export const findPaths = async (fromId, toId, options = {}) => {
  const { relationshipTypes = [], maxDepth = 5, maxPaths = 100 } = options;

  const paths = []; // Final collection of paths
  const queue = [[fromId]]; // BFS queue, stores paths as arrays of node IDs
  const seen = new Set(); // Tracks visited paths to prevent revisiting same sequence

  while (queue.length > 0 && paths.length < maxPaths) {
    const currentPath = queue.shift();
    const lastNodeId = currentPath[currentPath.length - 1];
    const lastNodeHex = lastNodeId.toString("hex");

    // Skip paths exceeding maxDepth
    if (currentPath.length > maxDepth) continue;

    // Skip paths already visited
    const pathKey = currentPath.map((id) => id.toString("hex")).join(",");
    if (seen.has(pathKey)) continue;
    seen.add(pathKey);

    // Check if target reached
    if (lastNodeId.equals(toId)) {
      // Fetch full node data for each node in the path
      const nodeData = await graphRepo.getNodesByIds(currentPath);
      const nodeMap = Object.fromEntries(
        nodeData.map((n) => [n.id.toString("hex"), n]),
      );
      const fullPath = currentPath.map((id) => nodeMap[id.toString("hex")]);
      paths.push(fullPath);
      continue;
    }

    // Enqueue neighbors that are not already in the current path (avoid cycles)
    const neighbors = await ERQ.getOutgoingNeighbors(
      lastNodeId,
      relationshipTypes,
    );
    for (const neighborId of neighbors) {
      if (!currentPath.some((id) => id.equals(neighborId))) {
        queue.push([...currentPath, neighborId]);
      }
    }
  }

  return paths;
};
