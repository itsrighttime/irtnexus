import { logger } from "#utils";
import { DEF_TENANT_ID, DEF_USER_ID } from "../helper/ids.js";
import { insertWithAudit } from "../helper/insertWithAudit.js";

export default async function seed() {
  const config = {
    table: "users",
    historyTable: "history_users",
    idField: "user_id",
    idValue: DEF_USER_ID,
    tenantId: DEF_TENANT_ID,
    timestamps: ["created_at", "updated_at"],
    tenant_id: DEF_TENANT_ID,
    data: {
      username: "danishan",
      status: "active",
      identity_level: "L4",
      role: "super_admin",
    },
  };

  await insertWithAudit(config);

  logger.info("User seeded successfully!");
}
