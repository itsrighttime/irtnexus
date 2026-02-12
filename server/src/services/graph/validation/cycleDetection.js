import { entityRelationshipQuery as ERQ } from "#queries";
import { hexToBinary } from "#utils";
import { logger } from "#utils";

/**
 * Detects if adding an edge from `fromId` to `toId` would create a cycle in the graph.
 *
 * Uses BFS from `toId` to check reachability of `fromId`.
 *
 * @param {Buffer} bufferFromId - ID of source entity
 * @param {Buffer} bufferToId - ID of target entity
 * @returns {Promise<boolean>} True if a cycle would be created
 */
export const wouldCreateCycle = async (bufferFromId, bufferToId) => {
  if (bufferFromId.equals(bufferToId)) {
    logger.warn("Self-loop detected, cycle would form", {
      fromId: bufferFromId.toString("hex"),
    });
    return true;
  }

  const visited = new Set();
  const queue = [bufferToId];

  while (queue.length) {
    const current = queue.shift();
    const hex = current.toString("hex");

    if (visited.has(hex)) continue;
    visited.add(hex);

    if (current.equals(bufferFromId)) {
      logger.warn("Cycle detected via BFS traversal", {
        fromId: bufferFromId.toString("hex"),
        toId: bufferToId.toString("hex"),
      });
      return true;
    }

    const neighbors = await ERQ.getOutgoingIds(current);
    neighbors.forEach((n) => queue.push(hexToBinary(n)));
  }

  logger.debug("No cycle detected, safe to add edge", {
    fromId: bufferFromId.toString("hex"),
    toId: bufferToId.toString("hex"),
  });
  return false;
};
