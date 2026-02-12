import { logger } from "#utils";
import { DEF_TENANT_ID } from "../helper/ids.js";
import { insertWithAudit } from "../helper/insertWithAudit.js";

export default async function seed() {
  const config = {
    table: "tenants",
    historyTable: "history_tenants",
    idField: "tenant_id",
    idValue: DEF_TENANT_ID,
    timestamps: ["created_at"],
    data: {
      name: "DEV",
      domain: "dev.itsrighttime.group",
      owner_email: "danishan089@gmail.com",
      contact_number: "9540514199",
    },
  };

  await insertWithAudit(config);

  logger.info("Tenant seeded successfully!");
}
