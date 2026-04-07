import {
  DB_RequestContext,
  DB_GLOBAL_CONST,
  withTransaction,
} from "#packages/database";
import { repoAccount } from "../repository";
import {
  ACCOUNT_IDENTITY_LEVEL,
  ACCOUNT_NAME_TYPE,
  ACCOUNT_STATUS,
  AccountIdentityLevel,
} from "../const";
import { EmailService } from "./email";
import { PhoneService } from "./phone";
import { NameService } from "./name";
import { AddressService } from "./address";
import { CreateAccountInput } from "../types";
import { PoolClient } from "pg";
import { AppError } from "#packages/errors";

export const AccountService = {
  /** ---------------- CREATE ACCOUNT ---------------- */
  async createAccount(
    params: CreateAccountInput,
    ctx: DB_RequestContext,
    client?: PoolClient,
  ) {
    const {
      name,
      email,
      password,
      rePassword,
      username,
      status,
      identity_level,
      preferred_language,
      preferred_timezone,
    } = params;

    const [existingUsername, existingEmail] = await Promise.all([
      repoAccount.findOne({ username }, ctx),
      EmailService.getEmail({ email }, ctx),
    ]);

    const errors: Record<string, string> = {};

    if (password !== rePassword)
      errors.password = "Password and Re-Password must be same";

    if (existingUsername) errors.username = "Username already taken";

    if (existingEmail) errors.email = "Email already in use";

    if (Object.keys(errors).length > 0) {
      throw new AppError(
        "Failed to create account due to validation errors",
        "ACCOUNT_CREATION_ERROR",
        {
          statusCode: 400,
          details: errors,
        },
      );
    }

    const result = await withTransaction(async (tx) => {
      const account = await repoAccount.create(
        {
          username: username,
          status: status || ACCOUNT_STATUS.PENDING_VERIFICATION,
          identity_level: identity_level || ACCOUNT_IDENTITY_LEVEL.UNVERIFIED,
          preferred_language: preferred_language,
          preferred_timezone: preferred_timezone,
        },
        ctx,
        tx,
      );

      const emailResult = await EmailService.addEmail(
        { accountId: account.account_id, email },
        ctx,
        tx,
      );
      const nameResult = await NameService.addName(
        {
          accountId: account.account_id,
          fullName: name,
          nameType: ACCOUNT_NAME_TYPE.SECONDARY,
        },
        ctx,
        tx,
      );
      return { account, email: emailResult, name: nameResult };
    }, client);

    return result;
  },

  /** ---------------- UPDATE ACCOUNT ---------------- */
  async updateAccount(
    params: {
      accountId: string;
      updates: Partial<CreateAccountInput>;
    },
    ctx: DB_RequestContext,
    client?: PoolClient,
  ) {
    const { accountId, updates } = params;

    return withTransaction(async (tx) => {
      const {
        name,
        email,
        username,
        preferred_language,
        preferred_timezone,
        status,
        identity_level,
      } = updates;

      /** ---------------- VALIDATIONS ---------------- */
      const errors: Record<string, string> = {};

      if (username) {
        const existingUsername = await repoAccount.findOne(
          { username },
          ctx,
          tx,
        );

        if (existingUsername && existingUsername.account_id !== accountId) {
          errors.username = "Username already taken";
        }
      }

      if (email) {
        const existingEmail = await EmailService.getEmail({ email }, ctx, tx);

        if (existingEmail && existingEmail.account_id !== accountId) {
          errors.email = "Email already in use";
        }
      }

      if (Object.keys(errors).length > 0) {
        throw new AppError(
          "Failed to update account due to validation errors",
          "ACCOUNT_UPDATE_ERROR",
          {
            statusCode: 400,
            details: errors,
          },
        );
      }

      /** ---------------- UPDATE CORE ACCOUNT ---------------- */
      let accountUpdateResult = null;

      const accountUpdates: any = {};

      if (username) accountUpdates.username = username;
      if (preferred_language)
        accountUpdates.preferred_language = preferred_language;
      if (preferred_timezone)
        accountUpdates.preferred_timezone = preferred_timezone;
      if (status) accountUpdates.status = status;
      if (identity_level) accountUpdates.identity_level = identity_level;

      if (Object.keys(accountUpdates).length > 0) {
        const [updated] = await repoAccount.updateWhere(
          { account_id: accountId },
          accountUpdates,
          ctx,
          tx,
        );

        accountUpdateResult = updated;
      }

      /** ---------------- UPDATE EMAIL ---------------- */
      let emailResult = null;

      if (email) {
        emailResult = await EmailService.addEmail(
          { accountId, email },
          ctx,
          tx,
        );
      }

      /** ---------------- UPDATE NAME ---------------- */
      let nameResult = null;

      if (name) {
        nameResult = await NameService.addName(
          {
            accountId,
            fullName: name,
            nameType: ACCOUNT_NAME_TYPE.SECONDARY,
          },
          ctx,
          tx,
        );
      }

      /** ---------------- RETURN ---------------- */
      return {
        account: accountUpdateResult,
        email: emailResult,
        name: nameResult,
      };
    }, client);
  },

  /** ---------------- DELETE ACCOUNT ---------------- */
  async deleteAccount(
    params: { accountId: string },
    ctx: DB_RequestContext,
    client?: any,
  ) {
    const { accountId } = params;
    await repoAccount.delete(accountId, ctx, client);
  },

  /** ---------------- GET ACCOUNT ---------------- */
  async getAccountById(params: { accountId: string }, client?: any) {
    const { accountId } = params;
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
    params: { accountId: string; level: AccountIdentityLevel },
    ctx: DB_RequestContext,
    client?: any,
  ) {
    const { accountId, level } = params;
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
    params: {
      accountId: string;
      preferences: { language?: string; timezone?: string };
    },
    ctx: DB_RequestContext,
    client?: any,
  ) {
    const { accountId, preferences } = params;
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
  async getProfile(params: { accountId: string }, ctx: DB_RequestContext) {
    const { accountId } = params;
    // 1. Fetch core account
    const account = await repoAccount.findOne({ account_id: accountId }, ctx);
    if (!account) throw new Error("Account not found");

    // 2. Fetch related data
    const [emails, phones, names, addresses] = await Promise.all([
      EmailService.listEmails({ accountId }, ctx),
      PhoneService.listPhones({ accountId }, ctx),
      NameService.listNames({ accountId }, ctx),
      AddressService.listAddresses({ accountId }, ctx),
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
