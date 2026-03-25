import { logger } from "#utils";
import { DEF_TENANT_ID, DEF_USER_ID, DEF_NAME_ID } from "../helper/ids.js";
import { insertWithAudit } from "../helper/insertWithAudit.js";

export default async function seed() {
  const config = {
    table: "user_names",
    historyTable: "history_user_names",
    idField: "name_id",
    idValue: DEF_NAME_ID,
    tenantId: DEF_TENANT_ID,
    timestamps: ["valid_from"],
    data: {
      user_id: DEF_USER_ID,
      full_name: "Danishan Farookh",
      name_type: "legal",
      verified: true,
    },
  };

  await insertWithAudit(config);

  logger.info("User name seeded successfully!");
}
