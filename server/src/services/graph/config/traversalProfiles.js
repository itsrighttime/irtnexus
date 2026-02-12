// src/config/traversalProfiles.js

import { EDGE_TYPES } from "./edgeTypes.js";


/**
 * Predefined traversal profiles for the entity graph.
 *
 * Each profile specifies:
 * - Which edge types are allowed for the traversal
 * - Traversal direction (upwards, downwards)
 * - Strategy for collecting nodes
 * - Ordering of nodes (BFS, DFS, stable)
 * - Optional stop conditions or maximum depth
 * - Whether to generate an explanation/debug trace
 *
 * These profiles are used across:
 * - Auth context evaluation
 * - Policy inheritance and overrides
 * - Billing or branding resolution
 * - Compliance boundary enforcement
 * - Subgraph extraction for UI/admin tools
 *
 * @readonly
 */
export const TRAVERSAL_PROFILES = Object.freeze({
  /* -------------------------------------------------
   * AUTH CONTEXT (token path, access scope)
   * ------------------------------------------------- */
  AUTH_CONTEXT: {
    name: "AUTH_CONTEXT",
    allowedEdgeTypes: [
      EDGE_TYPES.OWNS,
      EDGE_TYPES.CONTROLS,
      EDGE_TYPES.BELONGS_TO,
    ],
    direction: "up", // traverse parent entities
    strategy: "collect_all", // collect all reachable nodes
    ordering: "stable", // preserve insertion order
    maxDepth: 50, // prevent infinite traversal
    explain: true, // enable traversal explanation
  },

  /* -------------------------------------------------
   * POLICY INHERITANCE
   * ------------------------------------------------- */
  POLICY_INHERITANCE: {
    name: "POLICY_INHERITANCE",
    allowedEdgeTypes: [
      EDGE_TYPES.OWNS,
      EDGE_TYPES.CONTROLS,
      EDGE_TYPES.BELONGS_TO,
    ],
    direction: "up",
    strategy: "collect_all",
    ordering: "stable",
    stopConditions: [
      {
        type: "POLICY_OVERRIDE_FOUND", // stop traversal if a policy override is encountered
      },
    ],
    explain: true,
  },

  /* -------------------------------------------------
   * BILLING RESOLUTION
   * ------------------------------------------------- */
  BILLING_RESOLUTION: {
    name: "BILLING_RESOLUTION",
    allowedEdgeTypes: [EDGE_TYPES.BILLING_PARENT],
    direction: "up",
    strategy: "single_required", // exactly one parent entity is required
    ordering: "stable",
    maxDepth: 10,
    explain: true,
  },

  /* -------------------------------------------------
   * BRANDING RESOLUTION
   * ------------------------------------------------- */
  BRANDING_RESOLUTION: {
    name: "BRANDING_RESOLUTION",
    allowedEdgeTypes: [EDGE_TYPES.OWNS, EDGE_TYPES.BELONGS_TO],
    direction: "up",
    strategy: "first_match", // stop after first entity with branding info
    ordering: "stable",
    explain: true,
  },

  /* -------------------------------------------------
   * COMPLIANCE BOUNDARY
   * ------------------------------------------------- */
  COMPLIANCE_BOUNDARY: {
    name: "COMPLIANCE_BOUNDARY",
    allowedEdgeTypes: [EDGE_TYPES.DATA_RESIDENCY_PARENT],
    direction: "up",
    strategy: "single_required", // exactly one compliance parent required
    ordering: "stable",
    explain: true,
  },

  /* -------------------------------------------------
   * SUBGRAPH EXTRACTION (UI, admin tools)
   * ------------------------------------------------- */
  STRUCTURAL_SUBGRAPH: {
    name: "STRUCTURAL_SUBGRAPH",
    allowedEdgeTypes: [EDGE_TYPES.OWNS, EDGE_TYPES.HAS_SUB_ENTITY],
    direction: "down", // traverse children/sub-entities
    strategy: "collect_all", // collect all reachable nodes
    ordering: "breadth_first", // BFS traversal
    maxDepth: 100, // limit traversal depth
    explain: false, // no debug explanation needed
  },
});


