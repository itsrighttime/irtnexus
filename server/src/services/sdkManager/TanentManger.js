// server/tenantManager.js
import { ServerKeyManager } from "./keyManager.js";
import { logger } from "./helpers/logger.js";

/**
 * TenantManager - Manages tenants, users, and access policies
 */
export class TenantManager {
  constructor({ keyManager, tenantsDb = null } = {}) {
    if (!keyManager) throw new Error("ServerKeyManager instance is required");
    this.keyManager = keyManager;

    // For simplicity, we use an in-memory store if tenantsDb not provided
    this.tenantsDb = tenantsDb || new Map();
  }

  /**
   * Create a new tenant
   * @param {string} tenantId
   */
  createTenant(tenantId) {
    if (this.tenantsDb.has(tenantId)) {
      throw new Error(`Tenant ${tenantId} already exists`);
    }

    // Ensure keys are generated
    this.keyManager.ensureTenantKeys(tenantId);

    // Store tenant record
    this.tenantsDb.set(tenantId, {
      users: new Map(),
      policies: new Map(),
    });

    logger.info(`[TenantManager] Created tenant ${tenantId}`);
  }

  /**
   * Add a user to a tenant
   * @param {string} tenantId
   * @param {string} userId
   * @param {Object} userMeta - metadata, e.g., email, role
   */
  addUser(tenantId, userId, userMeta = {}) {
    const tenant = this._getTenant(tenantId);
    if (tenant.users.has(userId)) {
      throw new Error(`User ${userId} already exists in tenant ${tenantId}`);
    }

    tenant.users.set(userId, { meta: userMeta });
    logger.info(`[TenantManager] Added user ${userId} to tenant ${tenantId}`);
  }

  /**
   * Define a policy for a tenant
   * @param {string} tenantId
   * @param {string} resource
   * @param {string} action
   * @param {Function} decisionFn - returns true/false for userId & metadata
   */
  addPolicy(tenantId, resource, action, decisionFn) {
    const tenant = this._getTenant(tenantId);
    const key = `${resource}:${action}`;
    tenant.policies.set(key, decisionFn);
    logger.info(
      `[TenantManager] Policy added for tenant ${tenantId} on ${resource}:${action}`
    );
  }

  /**
   * Check access decision for a user
   * @param {string} tenantId
   * @param {string} userId
   * @param {string} resource
   * @param {string} action
   * @param {Object} metadata
   */
  getAccessDecision(tenantId, userId, resource, action, metadata = {}) {
    const tenant = this._getTenant(tenantId);

    if (!tenant.users.has(userId)) {
      return { status: "deny", reason: "User not found" };
    }

    const key = `${resource}:${action}`;
    const policyFn = tenant.policies.get(key);

    if (!policyFn) {
      return { status: "deny", reason: "No policy found" };
    }

    const allowed = policyFn(userId, metadata);

    return {
      status: allowed ? "allow" : "deny",
      permissions: allowed ? [{ resource, action }] : [],
    };
  }

  /**
   * Retrieve tenant info
   */
  getTenant(tenantId) {
    return this._getTenant(tenantId);
  }

  _getTenant(tenantId) {
    const tenant = this.tenantsDb.get(tenantId);
    if (!tenant) throw new Error(`Tenant ${tenantId} does not exist`);
    return tenant;
  }
}
