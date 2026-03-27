import { repoPermission, repoRole } from "#modules/identity";
import { withTransaction } from "#packages/database";
import { SYSTEM_DEFAULT } from "#tools/const";
import { logger } from "#utils";

export default async function seed() {
  withTransaction(async (tx) => {
    await repoRole.create(
      {
        name: SYSTEM_DEFAULT.ROLE,
        description: "Default Role that have full power",
      },
      {
        userId: null,
      },
      tx,
    );

    await repoPermission.create(
      {
        name: SYSTEM_DEFAULT.PERMISSION_ALL,
        description: "Default Permission that have full power",
      },
      {
        userId: null,
      },
      tx,
    );
  });

  logger.info("User name seeded successfully!");
}
