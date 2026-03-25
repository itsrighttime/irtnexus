const ALLOWED_ACTIONS = new Set([
  "SELECT",
  "INSERT",
  "UPDATE",
  "DELETE",
  "CREATE",
  "ALTER",
  "DROP",
]);

export function validateUserConfig(config: any) {
  for (const user of config) {
    if (!user.username) {
      throw new Error("User missing username");
    }

    if (!user.drop && !user.password) {
      throw new Error(`Password missing for ${user.username}`);
    }

    for (const p of user.privileges || []) {
      if (!p.db || !p.actions?.length) {
        throw new Error(`Invalid privilege for ${user.username}`);
      }

      for (const action of p.actions) {
        if (!ALLOWED_ACTIONS.has(action)) {
          throw new Error(`Invalid action "${action}"`);
        }
      }
    }
  }
}
