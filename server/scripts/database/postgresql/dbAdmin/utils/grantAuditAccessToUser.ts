import { DB_GLOBAL } from "#configs";
import { DB_TABLES_USER_MAP as TABLE_MAP } from "../../constant/tablePermissions.js";
import { syncPrivileges } from "./privilegeManager";

export async function grantAuditAccessToUser(
  user: { username: string },
  plan = false,
) {
  const auditPrivilege = {
    username: user.username,
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
