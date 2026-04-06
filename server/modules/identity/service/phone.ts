import {
  withTransaction,
  DB_RequestContext,
  DB_GLOBAL_CONST,
} from "#packages/database";
import { PoolClient } from "pg";
import { repoAccountPhone } from "../repository";

export const PhoneService = {
  /** ---------------- ADD PHONE ---------------- */
  async addPhone(
    accountId: string,
    phone: string,
    ctx: DB_RequestContext,
    client?: PoolClient,
  ) {
    // check existing
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

    await this.initiatePhoneVerification(accountId, phone, ctx, client);

    return created;
  },

  /** ---------------- INITIATE VERIFICATION ---------------- */
  async initiatePhoneVerification(
    accountId: string,
    phone: string,
    ctx: DB_RequestContext,
    client?: PoolClient,
  ) {
    // TODO: implement SMS verification / OTP send logic
    // For now, placeholder:
    console.log(`Send verification OTP to ${phone} for account ${accountId}`);
  },

  /** ---------------- VERIFY PHONE ---------------- */
  async verifyPhone(
    phone: string,
    ctx: DB_RequestContext,
    client?: PoolClient,
  ) {
    // Mark phone as verified
    const phoneRecords = await repoAccountPhone.updateWhere(
      { phone_number: phone },
      { verified_at: new Date() },
      ctx,
      client,
    );

    return { success: true, phoneId: phoneRecords[0].phone_id };
  },

  /** ---------------- SET PRIMARY ---------------- */
  async setPrimaryPhone(
    accountId: string,
    phoneId: string,
    ctx: DB_RequestContext,
    client?: PoolClient,
  ) {
    return withTransaction(async (tx) => {
      // 1. Validate ownership
      const phone = await repoAccountPhone.findOne(
        { phone_id: phoneId, account_id: accountId },
        ctx,
        tx,
      );
      if (!phone) throw new Error("Phone not found for this account");

      // 2. Prevent unverified
      if (!phone.verified_at)
        throw new Error("Cannot set unverified phone as primary");

      // 3. Idempotent check
      if (phone.is_primary) return phone;

      // 4. Unset existing primary
      await repoAccountPhone.updateWhere(
        { account_id: accountId, is_primary: true },
        { is_primary: false },
        ctx,
        tx,
      );

      // 5. Set new primary
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
    phoneId: string,
    ctx: DB_RequestContext,
    client?: PoolClient,
  ) {
    await repoAccountPhone.delete(phoneId, ctx, client);
  },

  /** ---------------- GET PHONE BY ID ---------------- */
  async getPhone(phoneId: string, client?: PoolClient) {
    return repoAccountPhone.findById(phoneId, client);
  },

  /** ---------------- LIST PHONES ---------------- */
  async listPhones(
    accountId: string,
    ctx: DB_RequestContext,
    client?: PoolClient,
  ) {
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
