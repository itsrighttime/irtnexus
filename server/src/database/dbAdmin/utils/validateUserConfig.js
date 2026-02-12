/**
 * Allowed MySQL actions for privilege configuration
 */
const ALLOWED_ACTIONS = new Set([
  "SELECT",
  "INSERT",
  "UPDATE",
  "DELETE",
  "CREATE",
  "ALTER",
  "INDEX",
  "DROP",
  "ALL PRIVILEGES",
]);

/**
 * Validate a user configuration object
 *
 * Ensures the structure and contents of the configuration are correct.
 * Throws errors for missing or invalid properties.
 *
 * @param {Object} config - Configuration object
 *   @property {Array<Object>} users - Array of user objects
 *     @property {string} username - MySQL username (required)
 *     @property {string} password - User password (required unless `drop` is true)
 *     @property {boolean} drop - Whether to drop the user (optional)
 *     @property {Array<Object>} privileges - Desired privileges (optional)
 *       @property {string} db - Database name (required)
 *       @property {Array<string>} actions - Privilege actions (required, must be in ALLOWED_ACTIONS)
 *
 * @throws {Error} Throws if any user or privilege configuration is invalid
 *
 * @example
 * validateUserConfig({
 *   users: [
 *     {
 *       username: "app_user",
 *       password: "Secret123!",
 *       privileges: [
 *         { db: "mydb", actions: ["SELECT", "INSERT"] }
 *       ]
 *     }
 *   ]
 * });
 */
export function validateUserConfig(config) {
  // Ensure `users` array exists
  if (!Array.isArray(config?.users)) {
    throw new Error("Invalid config: users[] missing");
  }

  for (const user of config.users) {
    // Each user must have a username
    if (!user.username) throw new Error("User missing username");

    // Password required unless user is marked for dropping
    if (!user.drop && !user.password) {
      throw new Error(`Password missing for ${user.username}`);
    }

    // Validate each privilege entry
    for (const p of user.privileges || []) {
      if (!p.db || !p.actions?.length) {
        throw new Error(`Invalid privilege for ${user.username}`);
      }

      // Ensure each action is allowed
      p.actions.forEach((action) => {
        if (!ALLOWED_ACTIONS.has(action)) {
          throw new Error(`Invalid action "${action}"`);
        }
      });
    }
  }
}
