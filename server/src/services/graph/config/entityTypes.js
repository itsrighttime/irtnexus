/**
 * Enumeration of all entity types in the system.
 *
 * Each entity type defines:
 * - Functional capabilities (users, ownership)
 * - Billing, branding, and compliance properties
 * - Logical category for hierarchy or business rules
 * - Human-readable description
 *
 * @readonly
 * @enum {Object}
 */
export const ENTITY_TYPES = Object.freeze({
  // -------------------
  // Structural / Organizational
  // -------------------
  ORGANIZATION: {
    name: "organization",
    category: "structural",
    canHaveUsers: true, // Users can belong to this entity
    canOwnEntities: true, // Can be parent of other entities
    billable: true, // Can be billed
    brandable: true, // Can have branding applied
    complianceBoundary: true, // Acts as a compliance boundary
    description: "Top-level logical tenant or company",
  },

  HOLDING: {
    name: "holding",
    category: "structural",
    canHaveUsers: false,
    canOwnEntities: true,
    billable: true,
    brandable: false,
    complianceBoundary: false,
    description: "Parent entity grouping multiple organizations",
  },

  LEGAL_ENTITY: {
    name: "legal_entity",
    category: "structural",
    canHaveUsers: false,
    canOwnEntities: true,
    billable: true,
    brandable: false,
    complianceBoundary: true,
    description: "Legal construct for contracts and invoicing",
  },

  DEPARTMENT: {
    name: "department",
    category: "structural",
    canHaveUsers: true,
    canOwnEntities: true,
    billable: false,
    brandable: false,
    complianceBoundary: false,
    description: "Functional grouping within an organization",
  },

  TEAM: {
    name: "team",
    category: "structural",
    canHaveUsers: true,
    canOwnEntities: false,
    billable: false,
    brandable: false,
    complianceBoundary: false,
    description: "Smallest operational unit",
  },

  // -------------------
  // Compliance / Geographical Boundaries
  // -------------------
  REGION: {
    name: "region",
    category: "compliance",
    canHaveUsers: false,
    canOwnEntities: false,
    billable: false,
    brandable: false,
    complianceBoundary: true,
    description: "Geographic or regulatory boundary",
  },

  // -------------------
  // Environments
  // -------------------
  WORKSPACE: {
    name: "workspace",
    category: "environment",
    canHaveUsers: true,
    canOwnEntities: false,
    billable: true,
    brandable: true,
    complianceBoundary: false,
    description: "Environment such as prod, staging, sandbox",
  },

  // -------------------
  // External / Multi-Tenant
  // -------------------
  CUSTOMER_ORG: {
    name: "customer_org",
    category: "external",
    canHaveUsers: true,
    canOwnEntities: false,
    billable: true,
    brandable: true,
    complianceBoundary: true,
    description: "Customer tenant in a multi-tenant SaaS",
  },

  PARTNER: {
    name: "partner",
    category: "external",
    canHaveUsers: true,
    canOwnEntities: true,
    billable: false,
    brandable: true,
    complianceBoundary: false,
    description: "Partner or franchise entity",
  },
});

export const getEnityTypes = () => Object.keys(ENTITY_TYPES);
