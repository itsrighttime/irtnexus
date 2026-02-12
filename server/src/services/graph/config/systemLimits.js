/**
 * System-wide limits and thresholds to ensure graph performance,
 * enforce constraints, and prevent abuse.
 *
 * These limits are used throughout the entity graph, policy evaluation,
 * relationship management, and auth subsystems.
 *
 * @readonly
 */
export const SYSTEM_LIMITS = Object.freeze({
  /* -------------------------------
   * Graph Traversal Limits
   * ------------------------------- */
  graph: {
    maxTraversalDepth: 100, // Maximum BFS/DFS depth when traversing graph
    maxAncestors: 100, // Maximum number of ancestor nodes to return
    maxDescendants: 500, // Maximum number of descendant nodes to return
    maxPathsEvaluated: 1000, // Maximum number of paths evaluated in path-finding
  },

  /* -------------------------------
   * Relationship Constraints
   * ------------------------------- */
  relationships: {
    maxOutgoingEdgesPerType: 100, // Maximum edges of same type from one entity
    maxIncomingEdgesPerType: 100, // Maximum edges of same type to one entity
    maxTotalEdgesPerEntity: 1000, // Maximum total edges per entity
  },

  /* -------------------------------
   * Auth / Token Context
   * ------------------------------- */
  auth: {
    maxContextPathLength: 20, // Max depth for auth context propagation
    maxRolesPerUserPerEntity: 50, // Max roles assigned to a user in an entity
    maxPermissionsPerRole: 200, // Max permissions per role
  },

  /* -------------------------------
   * Policy Evaluation
   * ------------------------------- */
  policies: {
    maxPoliciesPerEntity: 50, // Maximum number of policies per entity
    maxRulesPerPolicy: 100, // Maximum number of rules per policy
    maxPolicyEvaluationDepth: 50, // Maximum depth of policy evaluation recursion
  },

  /* -------------------------------
   * Billing / Financial
   * ------------------------------- */
  billing: {
    maxChargebackSplits: 50, // Max splits for chargeback calculations
    maxInvoicesPerCycle: 10000, // Max invoices generated per billing cycle
  },

  /* -------------------------------
   * Safety & Abuse Protection
   * ------------------------------- */
  safety: {
    maxRequestsPerSecondPerEntity: 1000, // Rate limit per entity
    maxAuditEventsPerRequest: 100, // Maximum audit events generated per request
  },
});
