import { logger } from "#utils";
import { DEF_TENANT_ID, DEF_USER_ID, DEF_ADDRESS_ID } from "../helper/ids.js";
import { insertWithAudit } from "../helper/insertWithAudit.js";

export default async function seed() {
  const config = {
    table: "user_addresses",
    historyTable: "history_user_addresses",
    idField: "address_id",
    idValue: DEF_ADDRESS_ID,
    tenantId: DEF_TENANT_ID,
    timestamps: ["valid_from"],
    data: {
      user_id: DEF_USER_ID,
      address_type: "home",
      house_no: "123",
      street_no: "MG Road",
      city: "Delhi",
      district: "New Delhi",
      state: "Delhi",
      country: "India",
      pincode: "110001",
      verified: true,
    },
  };

  await insertWithAudit(config);

  logger.info("User address seeded successfully!");
}
