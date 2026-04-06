import {
  withTransaction,
  DB_RequestContext,
  DB_GLOBAL_CONST,
} from "#packages/database";
import { PoolClient } from "pg";
import { repoAccountName } from "../repository";
import { ACCOUNT_NAME_TYPE, AccountNameType } from "../const";

export const NameService = {
  /** ---------------- ADD NAME ---------------- */
  async addName(
    accountId: string,
    fullName: string,
    nameType: AccountNameType = ACCOUNT_NAME_TYPE.PRIMARY,
    ctx: DB_RequestContext,
    client?: PoolClient,
  ) {
    // Optional: prevent duplicate names for same type
    const existing = await repoAccountName.findOne(
      { account_id: accountId, full_name: fullName },
      ctx,
      client,
    );
    if (existing) {
      throw new Error(`The given name is already exists for this account`);
    }

    const created = await repoAccountName.create(
      {
        account_id: accountId,
        full_name: fullName,
        name_type: nameType,
      },
      ctx,
      client,
    );

    return created;
  },

  /** ---------------- GET NAME BY ID ---------------- */
  async getName(nameId: string, client?: PoolClient) {
    return repoAccountName.findById(nameId, client);
  },

  /** ---------------- UPDATE NAME ---------------- */
  async updateName(
    nameId: string,
    updates: Partial<{ full_name: string; name_type: AccountNameType }>,
    ctx: DB_RequestContext,
    client?: PoolClient,
  ) {
    const [updated] = await repoAccountName.updateWhere(
      { name_id: nameId },
      updates,
      ctx,
      client,
    );
    return updated;
  },

  /** ---------------- DELETE NAME ---------------- */
  async deleteName(
    nameId: string,
    ctx: DB_RequestContext,
    client?: PoolClient,
  ) {
    await repoAccountName.delete(nameId, ctx, client);
  },

  /** ---------------- LIST NAMES ---------------- */
  async listNames(
    accountId: string,
    ctx: DB_RequestContext,
    client?: PoolClient,
  ) {
    return repoAccountName.select(
      {
        where: { account_id: accountId },
        orderBy: [
          {
            column: DB_GLOBAL_CONST.CREATED_AT,
            direction: DB_GLOBAL_CONST.DESC,
          },
        ],
      },
      ctx,
      client,
    );
  },

  /** ---------------- SET PRIMARY NAME ---------------- */
  async setPrimaryName(
    accountId: string,
    nameId: string,
    ctx: DB_RequestContext,
    client?: PoolClient,
  ) {
    return withTransaction(async (tx) => {
      // 1. Validate ownership
      const name = await repoAccountName.findOne(
        { name_id: nameId, account_id: accountId },
        ctx,
        tx,
      );
      if (!name) throw new Error("Name not found for this account");

      // Optional: check if already primary type
      if (name.name_type === ACCOUNT_NAME_TYPE.PRIMARY) return name;

      // 2. Demote existing primary
      await repoAccountName.updateWhere(
        { account_id: accountId, name_type: ACCOUNT_NAME_TYPE.PRIMARY },
        { name_type: ACCOUNT_NAME_TYPE.SECONDARY },
        ctx,
        tx,
      );

      // 3. Promote selected name
      const [updated] = await repoAccountName.updateWhere(
        { name_id: nameId, account_id: accountId },
        { name_type: ACCOUNT_NAME_TYPE.PRIMARY },
        ctx,
        tx,
      );

      return updated;
    }, client);
  },
};
