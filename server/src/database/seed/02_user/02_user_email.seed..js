import { logger } from "#utils";
import { DEF_TENANT_ID, DEF_USER_ID, DEF_EMAIL_ID } from "../helper/ids.js";
import { insertWithAudit } from "../helper/insertWithAudit.js";

export default async function seed() {
  const config = {
    table: "user_emails",
    historyTable: "history_user_emails",
    idField: "email_id",
    idValue: DEF_EMAIL_ID,
    tenantId: DEF_TENANT_ID,
    timestamps: ["added_at"],
    data: {
      user_id: DEF_USER_ID,
      email: "danishan089@gmail.com",
      verified: true,
      is_primary: true,
    },
  };

  await insertWithAudit(config);

  logger.info("User email seeded successfully!");
}
