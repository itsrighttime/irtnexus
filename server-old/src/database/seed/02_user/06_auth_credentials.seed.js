import { logger } from "#utils";
import { hashPassword } from "#utils";
import {
  DEF_TENANT_ID,
  DEF_USER_ID,
  DEF_CREDENTIAL_ID,
} from "../helper/ids.js";
import { insertWithAudit } from "../helper/insertWithAudit.js";

export default async function seed() {
  const config = {
    table: "auth_credentials",
    historyTable: "history_auth_credentials",
    idField: "credential_id",
    idValue: DEF_CREDENTIAL_ID,
    tenantId: DEF_TENANT_ID,
    timestamps: ["created_at"],
    data: {
      user_id: DEF_USER_ID,
      credential_type: "password",
      metadata: JSON.stringify({ password: hashPassword("Danishan@123") }),
    },
  };

  await insertWithAudit(config);

  logger.info("Auth credentials seeded successfully!");
}
