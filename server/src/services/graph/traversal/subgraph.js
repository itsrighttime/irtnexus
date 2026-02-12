import { traverseGraph } from "./traverseGraph.js";
import { entityRelationshipQuery } from "#queries";

/**
 * Retrieves a subgraph around a given entity, optionally including ancestors, descendants, or both.
 *
 * Performs BFS traversal to collect nodes, then fetches all relationships between the collected nodes.
 *
 * @param {Buffer|string} entityId - The starting entity ID.
 * @param {Object} [options] - Optional parameters for traversal and filtering.
 * @param {Array<string>} [options.relationshipTypes=[]] - Only include edges of these types.
 * @param {Array<string>} [options.entityTypeFilter=[]] - Only include nodes of these types.
 * @param {number} [options.maxDepth] - Maximum depth of traversal (overrides default limits).
 * @param {boolean} [options.includeAncestors=true] - Include ancestors (upstream nodes).
 * @param {boolean} [options.includeDescendants=true] - Include descendants (downstream nodes).
 * @returns {Promise<{nodes: Array<Object>, edges: Array<Object>}>}
 *          Object containing arrays of nodes and edges in the subgraph.
 *          Each edge includes `from`, `to` (Buffers), and `relationshipType`.
 */
export const getSubgraph = async (entityId, options = {}) => {
  const {
    relationshipTypes = [],
    entityTypeFilter = [],
    maxDepth,
    includeAncestors = true,
    includeDescendants = true,
  } = options;

  const nodes = new Map(); // key = hex string ID, value = node object
  const edges = new Map(); // key = from-to-type, value = edge object

  // Determine traversal directions: true = upwards (ancestors), false = downwards (descendants)
  const directions = [];
  if (includeAncestors) directions.push(true);
  if (includeDescendants) directions.push(false);

  // Traverse graph in each selected direction
  for (const upwards of directions) {
    const result = await traverseGraph(entityId, { ...options, upwards });
    result.forEach((node) => nodes.set(node.id.toString("hex"), node));
  }

  // Fetch edges connecting collected nodes
  if (nodes.size > 0) {
    const nodeIds = Array.from(nodes.keys()).map((hex) =>
      Buffer.from(hex, "hex"),
    );

    const rels = await entityRelationshipQuery.getRelationships(
      nodeIds,
      relationshipTypes,
    );

    // Map edges uniquely to prevent duplicates
    for (const r of rels) {
      const key = `${r.fromId.toString("hex")}-${r.toId.toString("hex")}-${r.relationship_type}`;
      edges.set(key, {
        from: r.fromId,
        to: r.toId,
        relationshipType: r.relationship_type,
      });
    }
  }

  return {
    nodes: Array.from(nodes.values()),
    edges: Array.from(edges.values()),
  };
};
