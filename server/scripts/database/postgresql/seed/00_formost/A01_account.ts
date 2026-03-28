import { repoAccount } from "#modules/identity";
import { SYSTEM_DEFAULT } from "#tools/const";
import { PoolClient } from "pg";

export default async function seed(client: PoolClient) {
  await repoAccount.create(
    {
      username: SYSTEM_DEFAULT.ACCOUNT_USERNAME,
    },
    {
      userId: null,
      tenantId: null,
    },
    client,
  );
}
