/**
 * Enumeration of all possible relationship/edge types in the entity graph.
 *
 * These are used to define the structure, hierarchy, and policies in the graph.
 * They are referenced by validation rules, traversal functions, and DAG/non-DAG logic.
 *
 * @readonly
 * @enum {string}
 */
export const EDGE_TYPES = Object.freeze({
  // -------------------
  // Structural / Hierarchy
  // -------------------
  OWNS: "OWNS", // Ownership relationship
  CONTROLS: "CONTROLS", // Control relationship
  BELONGS_TO: "BELONGS_TO", // Membership / parent-child
  HAS_SUB_ENTITY: "HAS_SUB_ENTITY", // Hierarchical composition

  // -------------------
  // Billing / Compliance
  // -------------------
  BILLING_PARENT: "BILLING_PARENT", // Billing hierarchy
  DATA_RESIDENCY_PARENT: "DATA_RESIDENCY_PARENT", // Data residency hierarchy

  // -------------------
  // Lateral / Trust
  // -------------------
  FEDERATES_WITH: "FEDERATES_WITH", // Peer federation relationships
  IMPERSONATES: "IMPERSONATES", // Impersonation / delegation

  // -------------------
  // Identity / Access (examples)
  // -------------------
  HAS_ROLE: "HAS_ROLE", // Role assignment edge
  ROLE_APPLIES_TO: "ROLE_APPLIES_TO", // Role application edge
});


export const getEdgeTypes = () => Object.values(EDGE_TYPES)