import { EDGE_TYPES } from "../config/edgeTypes.js";

/**
 * Set of relationship types that are **not constrained to be acyclic**.
 *
 * These edge types can form cycles or lateral connections in the graph.
 * They are not subject to DAG enforcement rules, unlike `DAG_EDGE_TYPES`.
 *
 * @type {Set<string>}
 */
export const NON_DAG_EDGE_TYPES = new Set([
  EDGE_TYPES.FEDERATES_WITH, // Peer-to-peer federated relationships
  EDGE_TYPES.IMPERSONATES, // Impersonation relationships
  EDGE_TYPES.HAS_ROLE, // Role assignment edges
  EDGE_TYPES.ROLE_APPLIES_TO, // Role application edges
]);
