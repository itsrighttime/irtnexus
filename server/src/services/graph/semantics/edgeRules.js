import { EDGE_TYPES } from "../config/edgeTypes.js";

/**
 * Rules and metadata for each edge type in the entity graph.
 *
 * These rules define:
 * - DAG enforcement
 * - Traversal directions
 * - Parent/child constraints
 * - Policy inheritance
 * - Domain applicability
 * - Cyclic or exclusive behavior
 *
 * This is used throughout the graph library to enforce structural and business rules
 * when creating or traversing relationships.
 *
 * @type {Object<string, Object>}
 */
export const EDGE_RULES = {
  // Ownership relationships: hierarchical, acyclic
  [EDGE_TYPES.OWNS]: {
    dag: true, // Must remain acyclic
    direction: "down", // Logical parent-to-child
    allowsMultipleParents: false, // Only one parent allowed
    inheritsPolicies: true, // Policies are inherited from parent
    traversal: {
      upward: true, // Can traverse upward in BFS
      downward: true, // Can traverse downward in BFS
    },
    domains: ["auth", "billing", "branding", "compliance"], // Relevant domains
  },

  // Control relationships: hierarchical, acyclic, multiple parents allowed
  [EDGE_TYPES.CONTROLS]: {
    dag: true,
    direction: "down",
    allowsMultipleParents: true,
    inheritsPolicies: true,
    traversal: {
      upward: true,
      downward: false,
    },
    domains: ["auth", "security"],
  },

  // Membership relationships: hierarchical, acyclic, multiple parents allowed
  [EDGE_TYPES.BELONGS_TO]: {
    dag: true,
    direction: "up",
    allowsMultipleParents: true,
    inheritsPolicies: true,
    traversal: {
      upward: true,
      downward: false,
    },
    domains: ["auth", "branding"],
  },

  // Billing hierarchy: DAG, single parent, exclusive
  [EDGE_TYPES.BILLING_PARENT]: {
    dag: true,
    direction: "up",
    allowsMultipleParents: false,
    inheritsPolicies: false,
    traversal: {
      upward: true,
      downward: false,
    },
    domains: ["billing"],
    exclusive: true, // Only one parent allowed
  },

  // Data residency hierarchy: DAG, single parent, exclusive
  [EDGE_TYPES.DATA_RESIDENCY_PARENT]: {
    dag: true,
    direction: "up",
    allowsMultipleParents: false,
    inheritsPolicies: false,
    traversal: {
      upward: true,
      downward: false,
    },
    domains: ["compliance"],
    exclusive: true, // Only one parent allowed
  },

  // Federated relationships: cyclic allowed, lateral traversal
  [EDGE_TYPES.FEDERATES_WITH]: {
    dag: false,
    cyclic: true, // Cycles allowed
    traversal: {
      lateral: true, // Traverse between peers
    },
    domains: ["auth"],
  },

  // Impersonation relationships: non-DAG, lateral traversal
  [EDGE_TYPES.IMPERSONATES]: {
    dag: false,
    cyclic: false, // Cycles not allowed
    traversal: {
      lateral: true,
    },
    domains: ["auth", "audit"],
  },
};
