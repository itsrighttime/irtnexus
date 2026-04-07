import {
  withTransaction,
  DB_RequestContext,
  DB_GLOBAL_CONST,
} from "#packages/database";
import { PoolClient } from "pg";
import { repoAccountPhone } from "../repository";
import { AppError } from "#packages/errors/AppError.js";

export const PhoneService = {
  /** ---------------- ADD PHONE ---------------- */
  async addPhone(
    params: { accountId: string; phone: string },
    ctx: DB_RequestContext,
    client?: PoolClient,
  ) {
    const { accountId, phone } = params;

    const existing = await repoAccountPhone.findOne(
      { phone_number: phone },
      ctx,
      client,
    );

    if (existing) {
      throw new Error("Phone number already in use");
    }

    const created = await repoAccountPhone.create(
      {
        account_id: accountId,
        phone_number: phone,
      },
      ctx,
      client,
    );

    await this.initiatePhoneVerification({ accountId, phone }, ctx, client);

    return created;
  },

  /** ---------------- INITIATE VERIFICATION ---------------- */
  async initiatePhoneVerification(
    params: { accountId: string; phone: string },
    ctx: DB_RequestContext,
    client?: PoolClient,
  ) {
    const { accountId, phone } = params;

    // TODO: implement SMS verification / OTP send logic
    console.log(`Send verification OTP to ${phone} for account ${accountId}`);
  },

  /** ---------------- VERIFY PHONE ---------------- */
  async verifyPhone(
    params: { phone: string },
    ctx: DB_RequestContext,
    client?: PoolClient,
  ) {
    const { phone } = params;

    const phoneRecords = await repoAccountPhone.updateWhere(
      { phone_number: phone },
      { verified_at: new Date() },
      ctx,
      client,
    );

    return { success: true, phoneId: phoneRecords[0]?.phone_id };
  },

  /** ---------------- SET PRIMARY ---------------- */
  async setPrimaryPhone(
    params: { accountId: string; phoneId: string },
    ctx: DB_RequestContext,
    client?: PoolClient,
  ) {
    const { accountId, phoneId } = params;

    return withTransaction(async (tx) => {
      const phone = await repoAccountPhone.findOne(
        { phone_id: phoneId, account_id: accountId },
        ctx,
        tx,
      );

      if (!phone) {
        throw new AppError(
          "Phone not found for this account",
          "PHONE_NOT_FOUND",
          {
            statusCode: 404,
          },
        );
      }

      if (!phone.verified_at) {
        throw new AppError(
          "Cannot set unverified phone as primary",
          "PHONE_NOT_VERIFIED",
          {
            statusCode: 400,
          },
        );
      }

      if (phone.is_primary) {
        return phone;
      }

      await repoAccountPhone.updateWhere(
        { account_id: accountId, is_primary: true },
        { is_primary: false },
        ctx,
        tx,
      );

      const [updated] = await repoAccountPhone.updateWhere(
        { phone_id: phoneId, account_id: accountId },
        { is_primary: true },
        ctx,
        tx,
      );

      return updated;
    }, client);
  },

  /** ---------------- DELETE PHONE ---------------- */
  async deletePhone(
    params: { phoneId: string },
    ctx: DB_RequestContext,
    client?: PoolClient,
  ) {
    const { phoneId } = params;
    await repoAccountPhone.delete(phoneId, ctx, client);
  },

  /** ---------------- GET PHONE BY ID ---------------- */
  async getPhone(
    params: { phoneId: string },
    ctx: DB_RequestContext,
    client?: PoolClient,
  ) {
    const { phoneId } = params;
    return repoAccountPhone.findById(phoneId, client);
  },

  /** ---------------- LIST PHONES ---------------- */
  async listPhones(
    params: { accountId: string },
    ctx: DB_RequestContext,
    client?: PoolClient,
  ) {
    const { accountId } = params;

    return repoAccountPhone.select(
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
};
