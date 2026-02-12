// Add this inside the seed() function, after creating the user

import { DatabaseFactory } from "#database/setup/DatabaseFactory.js";
import { generateBinaryUUID, logger } from "#utils";
import { DEF_TENANT_ID, DEF_USER_ID } from "../helper/ids.js";

const modules = [
  "users",
  "projects",
  "wallets",
  "marketing",
  "finance",
  "legal",
  "documents",
  "tasks",
  "reports",
  "communication",
];

const actions = ["view", "edit", "delete", "approve"];

const opUser = DatabaseFactory.userOp();
const auditUser = DatabaseFactory.userAudit();

export default async function seed() {
  for (const module of modules) {
    for (const action of actions) {
      const permissionId = generateBinaryUUID();
      // Insert into user_permissions
      await opUser.execute(
        `INSERT INTO user_permissions (permission_id, user_id, tenant_id, module, action, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
        [permissionId, DEF_USER_ID, DEF_TENANT_ID, module, action],
      );

      await auditUser.execute(
        `INSERT INTO history_user_permissions (history_id, tenant_id, user_id, changed_columns, changed_by, action_type, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, NOW())`,
        [
          generateBinaryUUID(),
          DEF_TENANT_ID,
          DEF_USER_ID,
          JSON.stringify({
            module: { old: null, new: module },
            action: { old: null, new: action },
            granted: { old: null, new: true },
          }),
          "system_seed",
          "create",
        ],
      );
    }
  }

  logger.info("User permissions seeded successfully!");
}
