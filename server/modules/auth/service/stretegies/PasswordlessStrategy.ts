import { DB_RequestContext } from "#packages/database";
import { ServiceResponse } from "#types";
import { AuthStrategy } from "../../types";
import { repoAccount, repoVerification } from "#modules/identity";
import { repoPasswordlessMethod } from "../../repository";
import { PoolClient } from "pg";
import {
  PASSWORDLESS_METHODS,
  VERIFICATION_STATUS,
  VerificationType,
  OtpCharset,
  PasswordlessMethod,
} from "../../const";
import { tokenProviderRegistry } from "../token-provider";

const DEFAULT_OTP_EXPIRY_MINUTES = 5;
const DEFAULT_COOLDOWN_SECONDS = 60;

// Helper to determine expiry per method
const methodExpiryMap: Record<PasswordlessMethod, number> = {
  [PASSWORDLESS_METHODS.OTP]: DEFAULT_OTP_EXPIRY_MINUTES,
  [PASSWORDLESS_METHODS.MAGIC_LINK]: 15,
  // [PASSWORDLESS_METHODS.PUSH]: 2,
  // [PASSWORDLESS_METHODS.PASSKEY]: 10,
};

export class PasswordlessStrategy implements AuthStrategy {
  /** ----------------- SETUP / REGISTER PASSWORDLESS METHOD ----------------- */
  async setup(
    ctx: DB_RequestContext,
    payload: {
      accountId: string;
      targetId: string;
      channel: VerificationType;
      methodType: PasswordlessMethod;
    },
    client?: PoolClient,
  ): Promise<ServiceResponse<{ methodId: string }>> {
    try {
      const { accountId, targetId, channel, methodType } = payload;

      // Validate account
      const account = await repoAccount.findOne(
        { account_id: accountId },
        ctx,
        client,
      );
      if (!account || account.account_id !== ctx.accountId) {
        return { success: false, message: "Unauthorized account access" };
      }

      // Check if method exists
      let method = await repoPasswordlessMethod.findOne(
        { account_id: accountId, channel, method_type: methodType },
        ctx,
        client,
      );

      if (!method) {
        method = await repoPasswordlessMethod.create(
          {
            account_id: accountId,
            tenant_id: ctx.tenantId,
            method_type: methodType,
            channel,
            device_info: { targetId },
          },
          ctx,
          client,
        );
      } else {
        // Restore deleted method or update target
        await repoPasswordlessMethod.update(
          method.method_id,
          {
            deleted_at: null,
            updated_at: new Date(),
            device_info: { targetId },
            channel,
            method_type: methodType,
          },
          ctx,
          client,
        );
      }

      return {
        success: true,
        data: { methodId: method.method_id },
        message: "Method registered successfully",
      };
    } catch {
      return {
        success: false,
        message: "Failed to register passwordless method",
      };
    }
  }

  /** ----------------- SEND ----------------- */
  async send(
    ctx: DB_RequestContext,
    payload: {
      accountId: string;
      methodId: string;
      length?: number;
      charset?: OtpCharset;
      cooldownSeconds?: number;
    },
    client?: PoolClient,
  ): Promise<ServiceResponse<{ verificationId: string; token?: string }>> {
    try {
      const {
        accountId,
        methodId,
        length,
        charset,
        cooldownSeconds = DEFAULT_COOLDOWN_SECONDS,
      } = payload;

      const method = await repoPasswordlessMethod.findOne(
        { method_id: methodId, account_id: accountId, deleted_at: null },
        ctx,
        client,
      );
      if (!method || !method.channel || !method.device_info?.targetId) {
        return {
          success: false,
          message: "Passwordless method not registered properly",
        };
      }

      const targetId = method.device_info.targetId;

      // Fetch existing pending verifications
      const oldVerifications = await repoVerification.select(
        {
          where: {
            account_id: accountId,
            target_id: targetId,
            type: method.channel,
            status: VERIFICATION_STATUS.PENDING,
          },
          orderBy: [{ column: "created_at", direction: "DESC" }],
        },
        ctx,
        client,
      );

      const now = new Date();
      if (oldVerifications.length > 0) {
        const latest = oldVerifications[0];
        const diffSeconds =
          (now.getTime() - new Date(latest.created_at).getTime()) / 1000;
        if (diffSeconds < cooldownSeconds) {
          return {
            success: false,
            message: `Already sent. Wait ${Math.ceil(cooldownSeconds - diffSeconds)}s before retry.`,
          };
        }
        // Expire old
        for (const v of oldVerifications) {
          await repoVerification.delete(v.verification_id, ctx, client);
        }
      }

      // 3. Token provider
      const provider = tokenProviderRegistry[method.method_type];
      if (!provider) {
        return { success: false, message: "Unsupported method type" };
      }

      const { raw, hashed } = await provider.generate({
        length,
        charset,
        targetId,
      });

      // Determine expiry
      const expiryMinutes =
        methodExpiryMap[method.method_type] ?? DEFAULT_OTP_EXPIRY_MINUTES;
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + expiryMinutes);

      const record = await repoVerification.create(
        {
          tenant_id: ctx.tenantId,
          account_id: accountId,
          target_id: targetId,
          type: method.channel,
          token: hashed ?? raw,
          status: VERIFICATION_STATUS.PENDING,
          expires_at: expiresAt,
        },
        ctx,
        client,
      );

      //   // TODO: Trigger notification service based on method_type/channel
      //   // 6. Notification handler
      //   const notifier = notificationRegistry[method.channel];
      //   if (!notifier) {
      //     return { success: false, message: "Unsupported notification channel" };
      //   }

      //   await notifier.send(targetId, raw, {
      //     methodType: method.method_type,
      //   });

      return {
        success: true,
        data: { verificationId: record.verification_id },
        message: `Sent via ${method.channel}`,
      };
    } catch {
      return { success: false, message: "Failed to send token" };
    }
  }

  /** ----------------- AUTHENTICATE ----------------- */
  async authenticate(
    ctx: DB_RequestContext,
    payload: { accountId: string; methodId: string; token: string },
    client?: PoolClient,
  ): Promise<ServiceResponse<{ verified: boolean }>> {
    try {
      const { accountId, methodId, token } = payload;

      const method = await repoPasswordlessMethod.findOne(
        { method_id: methodId, account_id: accountId },
        ctx,
        client,
      );
      if (!method)
        return { success: false, message: "Passwordless method not found" };

      const record = await repoVerification.findOne(
        {
          account_id: accountId,
          target_id: method.device_info?.targetId,
          type: method.channel,
          status: VERIFICATION_STATUS.PENDING,
        },
        ctx,
        client,
      );
      if (!record)
        return { success: false, message: "Token not found or expired" };
      if (record.expires_at < new Date()) {
        await repoVerification.update(
          record.verification_id,
          { status: VERIFICATION_STATUS.EXPIRED },
          ctx,
          client,
        );
        return { success: false, message: "Token expired" };
      }

      const provider = tokenProviderRegistry[method.method_type];
      const isValid = provider.verify(token, record.token);

      if (!isValid) return { success: false, message: "Invalid token" };

      await repoVerification.update(
        record.verification_id,
        { status: VERIFICATION_STATUS.VERIFIED, verified_at: new Date() },
        ctx,
        client,
      );

      return {
        success: true,
        data: { verified: true },
        message: "Verified successfully",
      };
    } catch {
      return { success: false, message: "Authentication failed" };
    }
  }

  /** ----------------- REVOKE METHOD ----------------- */
  async revoke(
    ctx: DB_RequestContext,
    payload: { accountId: string; methodId: string },
    client?: PoolClient,
  ): Promise<ServiceResponse<void>> {
    try {
      const method = await repoPasswordlessMethod.findOne(
        { method_id: payload.methodId, account_id: payload.accountId },
        ctx,
        client,
      );
      if (!method)
        return { success: false, message: "Passwordless method not found" };

      await repoPasswordlessMethod.delete(method.method_id, ctx, client);
      return {
        success: true,
        message: `Passwordless method ${method.channel} revoked`,
        data: undefined,
      };
    } catch {
      return {
        success: false,
        message: "Failed to revoke passwordless method",
      };
    }
  }

  /** ----------------- REVOKE PENDING VERIFICATIONS ----------------- */
  async revokeVerifications(
    ctx: DB_RequestContext,
    payload: { accountId: string; methodId: string },
    client?: PoolClient,
  ): Promise<ServiceResponse<void>> {
    try {
      const method = await repoPasswordlessMethod.findOne(
        { method_id: payload.methodId, account_id: payload.accountId },
        ctx,
        client,
      );
      if (!method)
        return { success: false, message: "Passwordless method not found" };

      const records = await repoVerification.select(
        {
          where: {
            account_id: payload.accountId,
            target_id: method.device_info?.targetId,
            type: method.channel,
            status: VERIFICATION_STATUS.PENDING,
          },
        },
        ctx,
        client,
      );
      for (const record of records)
        await repoVerification.delete(record.verification_id, ctx, client);

      return {
        success: true,
        message: `Pending verifications revoked for ${method.channel}`,
        data: undefined,
      };
    } catch {
      return { success: false, message: "Failed to revoke verifications" };
    }
  }

  /** ----------------- UPDATE METHOD ----------------- */
  async update(
    ctx: DB_RequestContext,
    payload: {
      accountId: string;
      methodId: string;
      newTargetId?: string;
      newChannel?: VerificationType;
    },
    client?: PoolClient,
  ): Promise<ServiceResponse<void>> {
    try {
      const method = await repoPasswordlessMethod.findOne(
        {
          method_id: payload.methodId,
          account_id: payload.accountId,
          deleted_at: null,
        },
        ctx,
        client,
      );
      if (!method)
        return { success: false, message: "Passwordless method not found" };

      const updates: Partial<typeof method> = {};
      if (payload.newTargetId)
        updates.device_info = {
          ...(method.device_info || {}),
          targetId: payload.newTargetId,
        };
      if (payload.newChannel) updates.channel = payload.newChannel;
      updates.updated_at = new Date();

      await repoPasswordlessMethod.update(
        method.method_id,
        updates,
        ctx,
        client,
      );

      // Revoke old pending verifications if target/channel changed
      if (payload.newTargetId || payload.newChannel) {
        await this.revokeVerifications(
          ctx,
          { accountId: payload.accountId, methodId: payload.methodId },
          client,
        );
      }

      return {
        success: true,
        data: undefined,
        message: "Passwordless method updated successfully",
      };
    } catch {
      return {
        success: false,
        message: "Failed to update passwordless method",
      };
    }
  }

  /** ----------------- VERIFY (dummy) ----------------- */
  async verify(): Promise<ServiceResponse<{ verified: boolean }>> {
    return { success: true, data: { verified: true } };
  }
}
