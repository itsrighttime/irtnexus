import { DB_GLOBAL, DB_TABLES_USER_MAP as TABLE_MAP } from "#config/db.js";
import { syncPrivileges } from "./privilegeManager.js";

/**
 * Ensure all users have SELECT + INSERT on audit tables
 */
export async function grantAuditAccessToUser(user, plan = false) {
  const auditPrivilege = {
    username: user.username,
    host: user.host,
    privileges: [
      {
        db: DB_GLOBAL.database,
        tables: TABLE_MAP.AUDIT,
        actions: ["SELECT", "INSERT"],
      },
    ],
  };

  await syncPrivileges(auditPrivilege, plan);
}
