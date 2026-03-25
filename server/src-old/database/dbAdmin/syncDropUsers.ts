import { dropUser } from "./utils/userManager.js";
import { DB_USERS } from "#database/config/user.config.js";

export async function syncDropUsers({ plan = false } = {}) {
  const need_deletion = DB_USERS.map((u) => ({
    username: u.username,
    host: u.host,
  }));

  for (const user of need_deletion) {
    const key = `${user.username}@${user.host}`;
    await dropUser(user, plan);
  }
}
