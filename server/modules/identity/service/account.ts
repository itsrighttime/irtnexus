import { DB_RequestContext, DB_GLOBAL_CONST } from "#packages/database";
import { repoAccount } from "../repository";
import {
  ACCOUNT_IDENTITY_LEVEL,
  ACCOUNT_STATUS,
  AccountIdentityLevel,
  AccountStatus,
} from "../const";
import { EmailService } from "./email";
import { PhoneService } from "./phone";
import { NameService } from "./name";
import { AddressService } from "./address";

export const AccountService = {
  /** ---------------- CREATE ACCOUNT ---------------- */
  async createAccount(
    data: {
      username: string;
      status?: AccountStatus;
      identity_level?: AccountIdentityLevel;
      preferred_language?: string;
      preferred_timezone?: string;
    },
    ctx: DB_RequestContext,
    client?: any,
  ) {
    const account = await repoAccount.create(
      {
        username: data.username,
        status: data.status || ACCOUNT_STATUS.ACTIVE,
        identity_level:
          data.identity_level || ACCOUNT_IDENTITY_LEVEL.UNVERIFIED,
        preferred_language: data.preferred_language,
        preferred_timezone: data.preferred_timezone,
      },
      ctx,
      client,
    );

    return account;
  },

  /** ---------------- UPDATE ACCOUNT ---------------- */
  async updateAccount(
    accountId: string,
    updates: Partial<{
      username: string;
      status: AccountStatus;
      identity_level: AccountIdentityLevel;
      preferred_language: string;
      preferred_timezone: string;
    }>,
    ctx: DB_RequestContext,
    client?: any,
  ) {
    const [updated] = await repoAccount.updateWhere(
      { account_id: accountId },
      updates,
      ctx,
      client,
    );

    return updated;
  },

  /** ---------------- DELETE ACCOUNT ---------------- */
  async deleteAccount(accountId: string, ctx: DB_RequestContext, client?: any) {
    await repoAccount.delete(accountId, ctx, client);
  },

  /** ---------------- GET ACCOUNT ---------------- */
  async getAccount(accountId: string, client?: any) {
    return repoAccount.findById(accountId, client);
  },

  /** ---------------- LIST ACCOUNTS ---------------- */
  async listAccounts(ctx: DB_RequestContext, client?: any) {
    return repoAccount.select(
      {
        where: { deleted_at: null },
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

  /** ---------------- UPDATE IDENTITY LEVEL ---------------- */
  async promoteIdentityLevel(
    accountId: string,
    level: AccountIdentityLevel,
    ctx: DB_RequestContext,
    client?: any,
  ) {
    const [updated] = await repoAccount.updateWhere(
      { account_id: accountId },
      { identity_level: level },
      ctx,
      client,
    );
    return updated;
  },

  /** ---------------- CHANGE PREFERRED SETTINGS ---------------- */
  async setPreferences(
    accountId: string,
    preferences: { language?: string; timezone?: string },
    ctx: DB_RequestContext,
    client?: any,
  ) {
    // Prepare only the fields that have actual values
    const updates: Partial<{
      preferred_language: string;
      preferred_timezone: string;
    }> = {};

    if (preferences.language !== undefined)
      updates.preferred_language = preferences.language;
    if (preferences.timezone !== undefined)
      updates.preferred_timezone = preferences.timezone;

    // If no fields are provided, return existing account without updating
    if (Object.keys(updates).length === 0) {
      return await repoAccount.findOne({ account_id: accountId }, ctx, client);
    }

    const [updated] = await repoAccount.updateWhere(
      { account_id: accountId },
      updates,
      ctx,
      client,
    );

    return updated;
  },

  /** ---------------- GET ACCOUNT PROFILE ---------------- */
  async getProfile(accountId: string, ctx: DB_RequestContext) {
    // 1. Fetch core account
    const account = await repoAccount.findOne({ account_id: accountId }, ctx);
    if (!account) throw new Error("Account not found");

    // 2. Fetch related data
    const [emails, phones, names, addresses] = await Promise.all([
      EmailService.listEmails(accountId, ctx),
      PhoneService.listPhones(accountId, ctx),
      NameService.listNames(accountId, ctx),
      AddressService.listAddresses(accountId, ctx),
    ]);

    // 3. Identify primary items
    const primary_email = emails.find((e) => e.is_primary)?.email || null;
    const primary_phone =
      phones.find((p) => p.is_primary)?.phone_number || null;

    // 4. Prepare KYC / identity status
    const kyc_status =
      account.identity_level === ACCOUNT_IDENTITY_LEVEL.UNVERIFIED
        ? "Pending"
        : account.identity_level === ACCOUNT_IDENTITY_LEVEL.VERIFIED
          ? "Verified"
          : "Unknown";

    // 5. Aggregate profile
    const profile = {
      account_id: account.account_id,
      username: account.username,
      identity_level: account.identity_level,

      emails,
      phones,
      names,
      addresses,

      primary_email,
      primary_phone,

      kyc_status,
    };

    return profile;
  },
};
