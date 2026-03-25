import { logger } from "#utils";
import { DEF_TENANT_ID, DEF_USER_ID, DEF_PHONE_ID } from "../helper/ids.js";
import { insertWithAudit } from "../helper/insertWithAudit.js";

export default async function seed() {
  const config = {
    table: "user_phones",
    historyTable: "history_user_phones",
    idField: "phone_id",
    idValue: DEF_PHONE_ID,
    tenantId: DEF_TENANT_ID,
    timestamps: ["added_at"],
    data: {
      user_id: DEF_USER_ID,
      phone_number: "9540514199",
      verified: true,
      is_primary: true,
    },
  };

  await insertWithAudit(config);

  logger.info("User phone seeded successfully!");
}
