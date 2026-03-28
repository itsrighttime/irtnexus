import { repoAccount, repoPermission, repoRole } from "#modules/identity";
import { SYSTEM_DEFAULT } from "#tools/const";
import { PoolClient } from "pg";

export default async function seed(client: PoolClient) {
  const account = await repoAccount.findOne(
    { username: SYSTEM_DEFAULT.ACCOUNT_USERNAME },
    {
      userId: null,
      tenantId: null,
    },
  );

  const userId = account?.account_id || null;

  await repoRole.create(
    {
      name: SYSTEM_DEFAULT.ROLE,
      description: "Default Role that have full power",
    },
    {
      userId: userId,
      tenantId: null,
    },
    client,
  );

  await repoPermission.create(
    {
      name: SYSTEM_DEFAULT.PERMISSION_ALL,
      description: "Default Permission that have full power",
    },
    {
      userId: userId,
      tenantId: null,
    },
    client,
  );
}
