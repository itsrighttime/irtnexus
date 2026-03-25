import { logger } from "#utils";
import { DEF_TENANT_ID, DEF_USER_ID, DEF_KEY_ID } from "../helper/ids.js";
import { insertWithAudit } from "../helper/insertWithAudit.js";

export default async function seed() {
  const config = {
    table: "user_keys",
    historyTable: "history_user_keys",
    idField: "key_id",
    idValue: DEF_KEY_ID,
    tenantId: DEF_TENANT_ID,
    timestamps: ["created_at"],
    data: {
      user_id: DEF_USER_ID,
      public_key: "dummy_public_key_123",
      key_type: "signing",
      status: "active",
    },
  };

  await insertWithAudit(config);

  logger.info("User key seeded successfully!");
}
