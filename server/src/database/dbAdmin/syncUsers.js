import config from "../config/user.config.js";
import { validateUserConfig } from "./utils/validateUserConfig.js";
import { createUser } from "./utils/userManager.js";
import { rotatePassword } from "./utils/passwordManager.js";
import { syncPrivileges } from "./utils/privilegeManager.js";
import { grantAuditAccessToUser } from "./utils/grantAuditAccessToUser.js";
import { logger } from "#utils";

/**
 * Synchronize MySQL users based on configuration
 *
 * Performs the following steps for each user in the config:
 * 1. Validates the configuration
 * 2. Skips users marked for dropping
 * 3. Creates the user if not exists
 * 4. Rotates the password if applicable
 * 5. Syncs privileges
 *
 * Supports a "plan" mode where actions are only logged without execution.
 *
 * @param {Object} options
 *   @property {boolean} plan - If true, logs all actions without executing them
 *
 * @returns {Promise<void>}
 *
 * @example
 * // Dry run
 * await syncUsers({ plan: true });
 *
 * // Actual execution
 * await syncUsers();
 */
export async function syncUsers({ plan = false } = {}) {
  // Validate the user configuration
  validateUserConfig(config);

  for (const user of config.users) {
    // Skip users marked for deletion
    if (user.drop) continue;

    logger.info(`Syncing user: ${user.username}`);

    // Ensure the user exists
    await createUser(user, plan);

    // Rotate password if required
    await rotatePassword(user, plan);

    // Synchronize privileges
    await syncPrivileges(user, plan);

    // Grant audit INSERT and SELECT access to EVERY user
    await grantAuditAccessToUser(user, plan);
  }

  logger.info(plan ? "PLAN COMPLETE" : "USER SYNC COMPLETE");
}
