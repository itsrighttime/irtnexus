import { EDGE_TYPES } from "../config/edgeTypes.js";

/**
 * A set of relationship types that are considered DAG (Directed Acyclic Graph) edges.
 *
 * These edge types are subject to cycle prevention rules in the graph.
 * Only relationships of these types should be checked when enforcing acyclicity.
 *
 * @type {Set<string>}
 */
export const DAG_EDGE_TYPES = new Set([
  EDGE_TYPES.OWNS, // Ownership relationships
  EDGE_TYPES.CONTROLS, // Control relationships
  EDGE_TYPES.BELONGS_TO, // Membership or parent-child relationships
  EDGE_TYPES.HAS_SUB_ENTITY, // Hierarchical composition
  EDGE_TYPES.BILLING_PARENT, // Billing hierarchy edges
  EDGE_TYPES.DATA_RESIDENCY_PARENT, // Data residency hierarchy edges
]);
