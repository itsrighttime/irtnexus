// server/policyEngine.js
import { logger } from "./helpers/logger.js";

/**
 * PolicyEngine - Evaluates access policies for tenants/users
 */
export class PolicyEngine {
  constructor(tenantManager) {
    if (!tenantManager) throw new Error("TenantManager instance is required");
    this.tenantManager = tenantManager;
  }

  /**
   * Evaluate access for a user, tenant, resource, and action
   * @param {string} tenantId
   * @param {string} userId
   * @param {string} resource
   * @param {string} action
   * @param {Object} metadata - optional extra info for policies
   * @returns {Object} decision { status: "allow"|"deny", advisory?: {} }
   */
  evaluate(tenantId, userId, resource, action, metadata = {}) {
    try {
      const decision = this.tenantManager.getAccessDecision(
        tenantId,
        userId,
        resource,
        action,
        metadata,
      );

      // Optionally, attach advisory/risk metadata
      const advisory = this._checkSecurityAdvisory(userId, metadata);

      return { ...decision, advisory };
    } catch (err) {
      logger.error(
        `[PolicyEngine] Error evaluating policy for tenant=${tenantId}, user=${userId}, resource=${resource}, action=${action}`,
      );
      logger.error(err);
      return { status: "deny", reason: "policy evaluation error" };
    }
  }

  /**
   * Simple advisory/risk check
   * In production, this can be connected to ML models, fraud scoring, etc.
   */
  _checkSecurityAdvisory(userId, metadata) {
    // Example: if user flagged in metadata, mark high risk
    if (metadata?.isHighRisk) {
      return { riskLevel: "high", reason: "User flagged as high risk" };
    }

    return { riskLevel: "low" };
  }
}
