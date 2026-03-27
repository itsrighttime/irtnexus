import { repoAccount } from "#modules/identity";
import { SYSTEM_DEFAULT } from "#tools/const";
import { logger } from "#utils";

export default async function seed() {
  repoAccount.create(
    {
      username: SYSTEM_DEFAULT.ACCOUNT_USERNAME,
    },
    {
      userId: null,
    },
  );

  logger.info("User name seeded successfully!");
}
