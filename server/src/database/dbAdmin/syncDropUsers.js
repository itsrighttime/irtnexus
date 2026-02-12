import config from "../config/user.config.js";
import { dropUser } from "./utils/userManager.js";
import { logger } from "#utils";

/**
 * Synchronizes user deletions by dropping all users defined in the config.
 *
 * Iterates over configured users, logs a warning for each, and invokes
 * {@link dropUser} to remove them. Can optionally run in "plan" mode
 * without performing destructive actions.
 *
 * @async
 * @function syncDropUsers
 * @param {Object} [options]
 * @param {boolean} [options.plan=false] - If true, runs in dry-run mode
 *   (no actual deletion, only planning/logging).
 * @returns {Promise<void>} Resolves when all users have been processed.
 */
export async function syncDropUsers({ plan = false } = {}) {
  const need_deletion = config.users.map((u) => ({
    username: u.username,
    host: u.host,
  }));

  for (const user of need_deletion) {
    const key = `${user.username}@${user.host}`;
    await dropUser(user, plan);
  }
}
