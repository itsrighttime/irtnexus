import { DB_RequestContext } from "#packages/database";
import { ServiceResponse } from "#types";
import bcrypt from "bcrypt";
import { AuthStrategy } from "../../types";
import { repoPassword } from "../../repository";
import { repoAccount } from "#modules/identity/index.js";
import { PASSWORD_REGEX } from "../../const";
import { PoolClient } from "pg";

const SALT_ROUNDS = 12;

export class PasswordStrategy implements AuthStrategy {
  /** ----------------- SETUP ----------------- */
  async setup(
    ctx: DB_RequestContext,
    payload: {
      accountId: string;
      password: string;
      confirmPassword: string;
    },
    client?: PoolClient,
  ): Promise<ServiceResponse<{ passwordId: string }>> {
    try {
      const { accountId, password, confirmPassword } = payload;

      // 1. Match passwords
      if (password !== confirmPassword) {
        return {
          success: false,
          errors: {
            confirmPassword: "Passwords do not match",
          },
        };
      }

      // 2. Strength validation
      if (!PASSWORD_REGEX.test(password)) {
        return {
          success: false,
          errors: {
            password:
              "Password must include uppercase, lowercase, number, and special character",
          },
        };
      }

      // 3. Validate account ownership
      const account = await repoAccount.findOne(
        {
          account_id: accountId,
          // enforce tenant + user binding
        },
        ctx,
        client,
      );

      if (!account || account.account_id !== ctx.userId) {
        return {
          success: false,
          message: "Unauthorized account access",
        };
      }

      // 4. Prevent duplicate password
      const existing = await repoPassword.findOne(
        { account_id: accountId },
        ctx,
        client,
      );

      if (existing) {
        return {
          success: false,
          message: "Password already set",
        };
      }

      // 5. Hash
      const hash = await bcrypt.hash(password, SALT_ROUNDS);

      const created = await repoPassword.create(
        {
          account_id: accountId,
          tenant_id: ctx.tenantId,
          password_hash: hash,
          last_changed_at: new Date(),
        },
        ctx,
        client,
      );

      return {
        success: true,
        data: { passwordId: created.password_id },
        message: "Password setup successful",
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to setup password",
      };
    }
  }

  /** ----------------- AUTHENTICATE ----------------- */
  async authenticate(
    ctx: DB_RequestContext,
    payload: { accountId: string; password: string },
    client?: PoolClient,
  ): Promise<ServiceResponse<{ valid: boolean }>> {
    try {
      const { accountId, password } = payload;

      const record = await repoPassword.findOne(
        { account_id: accountId },
        ctx,
        client,
      );

      if (!record) {
        return {
          success: false,
          message: "Invalid credentials",
        };
      }

      const isValid = await bcrypt.compare(password, record.password_hash);

      if (!isValid) {
        return {
          success: false,
          message: "Invalid credentials",
        };
      }

      return {
        success: true,
        data: { valid: true },
      };
    } catch {
      return {
        success: false,
        message: "Authentication failed",
      };
    }
  }

  /** ----------------- VERIFY ----------------- */
  async verify(): Promise<ServiceResponse<{ verified: boolean }>> {
    return {
      success: true,
      data: { verified: true },
    };
  }

  /** ----------------- UPDATE ----------------- */
  async update(
    ctx: DB_RequestContext,
    payload: {
      accountId: string;
      oldPassword: string;
      newPassword: string;
      confirmPassword: string;
    },
    client?: PoolClient,
  ): Promise<ServiceResponse<void>> {
    try {
      const { accountId, oldPassword, newPassword, confirmPassword } = payload;

      // 1. Confirm password match
      if (newPassword !== confirmPassword) {
        return {
          success: false,
          errors: {
            confirmPassword: "Passwords do not match",
          },
        };
      }

      // 2. Strength check
      if (!PASSWORD_REGEX.test(newPassword)) {
        return {
          success: false,
          errors: {
            password: "Weak password",
          },
        };
      }

      // 3. Fetch record
      const record = await repoPassword.findOne(
        { account_id: accountId },
        ctx,
        client,
      );

      if (!record) {
        return {
          success: false,
          message: "Password not found",
        };
      }

      // 4. Validate old password
      const isValid = await bcrypt.compare(oldPassword, record.password_hash);

      if (!isValid) {
        return {
          success: false,
          errors: {
            oldPassword: "Incorrect password",
          },
        };
      }

      // 5. Prevent reuse
      const samePassword = await bcrypt.compare(
        newPassword,
        record.password_hash,
      );

      if (samePassword) {
        return {
          success: false,
          errors: {
            newPassword: "New password must be different",
          },
        };
      }

      // 6. Hash + update
      const newHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

      await repoPassword.update(
        record.password_id,
        {
          password_hash: newHash,
          last_changed_at: new Date(),
        },
        ctx,
        client,
      );

      return {
        success: true,
        data: undefined,
        message: "Password updated successfully",
      };
    } catch {
      return {
        success: false,
        message: "Failed to update password",
      };
    }
  }

  /** ----------------- REVOKE ----------------- */
  async revoke(
    ctx: DB_RequestContext,
    payload: { accountId: string },
    client?: PoolClient,
  ): Promise<ServiceResponse<void>> {
    try {
      const record = await repoPassword.findOne(
        { account_id: payload.accountId },
        ctx,
        client,
      );

      if (!record) {
        return {
          success: false,
          message: "Password not found",
        };
      }

      await repoPassword.delete(record.password_id, ctx, client);

      return {
        success: true,
        data: undefined,
        message: "Password removed",
      };
    } catch {
      return {
        success: false,
        message: "Failed to revoke password",
      };
    }
  }
}
