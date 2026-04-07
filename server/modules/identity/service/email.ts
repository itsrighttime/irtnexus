import { GENERAl_CONST } from "#configs";
import {
  DB_GLOBAL_CONST,
  DB_RequestContext,
  withTransaction,
} from "#packages/database";
import { sendMailIdVerifcationEmail } from "#packages/mail";
import { generateUUID } from "#packages/utils";
import { PoolClient } from "pg";
import { repoAccount, repoAccountEmail, repoVerification } from "../repository";
import {
  ACCOUNT_IDENTITY_LEVEL,
  VERIFICATION_STATUS,
  VERIFICATION_TYPE,
} from "../const";

export const EmailService = {
  /** ---------------- ADD EMAIL ---------------- */
  async addEmail(
    params: { accountId: string; email: string },
    ctx: DB_RequestContext,
    client?: PoolClient,
  ) {
    const { accountId, email } = params;

    // check existing
    const existing = await repoAccountEmail.findOne({ email }, ctx, client);

    if (existing) {
      throw new Error("Email already in use");
    }

    const created = await repoAccountEmail.create(
      {
        account_id: accountId,
        email,
      },
      ctx,
      client,
    );

    await this.initiateEmailVerification({ accountId, email }, ctx, client);

    return created;
  },

  async initiateEmailVerification(
    params: { accountId: string; email: string },
    ctx: DB_RequestContext,
    client?: PoolClient,
  ) {
    const { accountId, email } = params;

    const verificationToken = generateUUID();
    const expireMinutes = 30;
    const expiresAt = new Date(Date.now() + expireMinutes * 60 * 1000);
    const verificationLink = `${GENERAl_CONST.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    const verification = await repoVerification.create(
      {
        tenant_id: ctx.tenantId,
        account_id: accountId,
        target_id: email,
        type: VERIFICATION_TYPE.EMAIL,
        token: verificationToken,
        expires_at: expiresAt,
      },
      ctx,
      client,
    );

    // TEMP: direct call (we'll replace with event) TODO
    await sendMailIdVerifcationEmail(
      email,
      "", // name optional (can enrich later)
      verificationLink,
      expireMinutes,
    );

    return verification;
  },

  /** ---------------- VERIFY EMAIL ---------------- */
  async verifyEmail(
    params: { token: string },
    ctx: DB_RequestContext,
    client?: PoolClient,
  ) {
    const { token } = params;
    // 1 Fetch verification record
    const verification = await repoVerification.findOne({ token }, ctx, client);
    if (!verification) {
      throw new Error("Invalid verification token");
    }

    // 2 Check expiration
    if (verification.expires_at < new Date()) {
      throw new Error("Verification token has expired");
    }

    // 2.1 Check expiration for pending status (optional, can auto-expire or keep as is)
    if (verification.status !== VERIFICATION_STATUS.PENDING) {
      throw new Error("Verification token is not pending");
    }

    const emailId = verification.target_id;
    const accountId = verification.account_id;

    if (!accountId) {
      throw new Error("Account Id must be present in verification record");
    }

    // 3 Mark email as verified
    await repoAccountEmail.updateWhere(
      { email_id: emailId, account_id: accountId },
      { verified_at: new Date() },
      ctx,
    );

    // 4 Promote account identity level if needed
    const account = await repoAccount.findOne({ account_id: accountId }, ctx);
    if (
      account &&
      account.identity_level === ACCOUNT_IDENTITY_LEVEL.UNVERIFIED
    ) {
      await repoAccount.updateWhere(
        { account_id: accountId },
        { identity_level: ACCOUNT_IDENTITY_LEVEL.VERIFIED },
        ctx,
      );
    }

    // 5 Cleanup verification record (optional)
    await repoVerification.updateWhere(
      { verification_id: verification.verification_id },
      { status: VERIFICATION_STATUS.VERIFIED, verified_at: new Date() },
      ctx,
    );

    return { success: true, accountId, emailId };
  },

  /** ---------------- SET PRIMARY ---------------- */
  async setPrimaryEmail(
    params: { accountId: string; emailId: string },
    ctx: DB_RequestContext,
    client?: PoolClient,
  ) {
    const { accountId, emailId } = params;

    return withTransaction(async (tx) => {
      /** 1. Validate ownership */
      const email = await repoAccountEmail.findOne(
        {
          email_id: emailId,
          account_id: accountId,
        },
        ctx,
        tx,
      );

      if (!email) {
        throw new Error("Email not found for this account");
      }

      /** 2. Prevent unverified */
      if (!email.verified_at) {
        throw new Error("Cannot set unverified email as primary");
      }

      /** 3. Idempotent check */
      if (email.is_primary) {
        return email;
      }

      /** 4. Unset existing primary */
      await repoAccountEmail.updateWhere(
        {
          account_id: accountId,
          is_primary: true,
        },
        {
          is_primary: false,
        },
        ctx,
        tx,
      );

      /** 5. Set new primary */
      const [updated] = await repoAccountEmail.updateWhere(
        {
          email_id: emailId,
          account_id: accountId,
        },
        {
          is_primary: true,
        },
        ctx,
        tx,
      );

      return updated;
    }, client);
  },

  /** ---------------- DELETE EMAIL ---------------- */
  async deleteEmail(
    params: { emailId: string },
    ctx: DB_RequestContext,
    client?: PoolClient,
  ) {
    const { emailId } = params;
    await repoAccountEmail.delete(emailId, ctx, client);
  },

  /** ---------------- LIST EMAILS ---------------- */
  async listEmails(
    params: { accountId: string },
    ctx: DB_RequestContext,
    client?: PoolClient,
  ) {
    const { accountId } = params;
    return repoAccountEmail.select(
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

  /** ---------------- GET EMAIL BY ID ---------------- */
  async getEmailById(
    params: { emailId: string },
    ctx?: DB_RequestContext,
    client?: PoolClient,
  ) {
    const { emailId } = params;
    return repoAccountEmail.findById(emailId, client);
  },
  /** ---------------- GET EMAIL BY ID ---------------- */
  async getEmail(
    params: { email: string },
    ctx: DB_RequestContext,
    client?: PoolClient,
  ) {
    const { email } = params;
    return repoAccountEmail.findOne({ email }, ctx, client);
  },
};
