import { DB_USERS } from "../config/user.config.js";
import { validateUserConfig } from "./utils/validateUserConfig.js";
import { createUser, dropUser } from "./utils/userManager.js";
import { rotatePassword } from "./utils/passwordManager.js";
import { syncPrivileges } from "./utils/privilegeManager.js";
import { grantAuditAccessToUser } from "./utils/grantAuditAccessToUser.js";
import { logger } from "#utils";

export async function syncUsers({ plan = false } = {}) {
  validateUserConfig(DB_USERS);

  for (const user of DB_USERS) {
    const key = `${user.username}@${user.host ?? "%"}`;

    if (user.drop) {
      logger.warn(`Dropping user: ${key}`);
      await dropUser(user, plan);
      continue;
    }

    logger.info(`Syncing user: ${key}`);

    await createUser(user, plan);
    await rotatePassword(user, plan);
    await syncPrivileges(user, plan);
    await grantAuditAccessToUser(user, plan);
  }

  logger.info(plan ? "PLAN COMPLETE" : "USER SYNC COMPLETE");
}
