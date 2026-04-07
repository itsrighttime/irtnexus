import {
  withTransaction,
  DB_RequestContext,
  DB_GLOBAL_CONST,
} from "#packages/database";
import { PoolClient } from "pg";
import { repoAccountName } from "../repository";
import { ACCOUNT_NAME_TYPE, AccountNameType } from "../const";
import { AppError } from "#packages/errors/AppError.js";

export const NameService = {
  /** ---------------- ADD NAME ---------------- */
  async addName(
    params: {
      accountId: string;
      fullName: string;
      nameType?: AccountNameType;
    },
    ctx: DB_RequestContext,
    client?: PoolClient,
  ) {
    const {
      accountId,
      fullName,
      nameType = ACCOUNT_NAME_TYPE.PRIMARY,
    } = params;

    const existing = await repoAccountName.findOne(
      { account_id: accountId, full_name: fullName },
      ctx,
      client,
    );

    if (existing) {
      throw new Error(`The given name already exists for this account`);
    }

    return repoAccountName.create(
      {
        account_id: accountId,
        full_name: fullName,
        name_type: nameType,
      },
      ctx,
      client,
    );
  },

  /** ---------------- GET NAME BY ID ---------------- */
  async getName(
    params: { nameId: string },
    ctx: DB_RequestContext,
    client?: PoolClient,
  ) {
    const { nameId } = params;
    return repoAccountName.findById(nameId, client);
  },

  /** ---------------- UPDATE NAME ---------------- */
  async updateName(
    params: {
      nameId: string;
      updates: Partial<{
        full_name: string;
        name_type: AccountNameType;
      }>;
    },
    ctx: DB_RequestContext,
    client?: PoolClient,
  ) {
    const { nameId, updates } = params;

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
    params: { nameId: string },
    ctx: DB_RequestContext,
    client?: PoolClient,
  ) {
    const { nameId } = params;
    await repoAccountName.delete(nameId, ctx, client);
  },

  /** ---------------- LIST NAMES ---------------- */
  async listNames(
    params: { accountId: string },
    ctx: DB_RequestContext,
    client?: PoolClient,
  ) {
    const { accountId } = params;

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
    params: { accountId: string; nameId: string },
    ctx: DB_RequestContext,
    client?: PoolClient,
  ) {
    const { accountId, nameId } = params;

    return withTransaction(async (tx) => {
      const name = await repoAccountName.findOne(
        { name_id: nameId, account_id: accountId },
        ctx,
        tx,
      );

      if (!name) {
        throw new AppError(
          "Name not found for this account",
          "NAME_NOT_FOUND",
          {
            statusCode: 404,
          },
        );
      }

      if (name.name_type === ACCOUNT_NAME_TYPE.PRIMARY) {
        return name;
      }

      await repoAccountName.updateWhere(
        { account_id: accountId, name_type: ACCOUNT_NAME_TYPE.PRIMARY },
        { name_type: ACCOUNT_NAME_TYPE.SECONDARY },
        ctx,
        tx,
      );

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
