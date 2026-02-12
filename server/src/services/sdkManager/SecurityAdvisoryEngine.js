// server/securityAdvisoryEngine.js
import { logger } from "./helpers/logger.js";

/**
 * SecurityAdvisoryEngine - Evaluates security risks for users/actions
 */
export class SecurityAdvisoryEngine {
  constructor({ riskRules = [] } = {}) {
    /**
     * riskRules is an array of objects:
     * {
     *   name: "suspiciousIp",
     *   evaluate: (userId, action, metadata) => boolean,
     *   riskLevel: "high" | "medium" | "low",
     *   reason: "string"
     * }
     */
    this.riskRules = riskRules;
  }

  /**
   * Evaluate advisory for a specific user/action/resource
   * @param {string} userId
   * @param {string} resource
   * @param {string} action
   * @param {Object} metadata - optional extra context
   * @returns {Object} advisory { riskLevel, reasons: [] }
   */
  evaluate(userId, resource, action, metadata = {}) {
    const reasons = [];
    let highestRisk = "low";

    for (const rule of this.riskRules) {
      try {
        if (rule.evaluate(userId, resource, action, metadata)) {
          reasons.push(`${rule.name}: ${rule.reason}`);

          if (rule.riskLevel === "high") highestRisk = "high";
          else if (rule.riskLevel === "medium" && highestRisk !== "high")
            highestRisk = "medium";
        }
      } catch (err) {
        logger.error(
          `[SecurityAdvisoryEngine] Error evaluating rule ${rule.name}`,
        );
        logger.error(err);
      }
    }

    return { riskLevel: highestRisk, reasons };
  }

  /**
   * Add a new advisory rule dynamically
   */
  addRule(rule) {
    if (
      !rule.name ||
      typeof rule.evaluate !== "function" ||
      !rule.riskLevel ||
      !rule.reason
    ) {
      throw new Error("Invalid rule format");
    }
    this.riskRules.push(rule);
  }
}
