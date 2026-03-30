import { DB_RequestContext } from "#packages/database";
import { ServiceResponse } from "#types";
import { AuthStrategy } from "../../types";
import { repoAccount, repoVerification } from "#modules/identity";
import { PoolClient } from "pg";
import bcrypt from "bcrypt";
import {
  OTP_CHARSET,
  OtpCharset,
  PASSWORDLESS_METHODS,
  VERIFICATION_STATUS,
  VERIFICATION_TYPE,
  VerificationType,
} from "../../const";
import { generateOtp } from "../helper/generateOtp";
import { repoPasswordlessMethod } from "../../repository";

const DEFAULT_OTP_LENGTH = 6;
const DEFAULT_OTP_EXPIRY_MINUTES = 5;
const SALT_ROUNDS = 12;

/** ----------------- OTP STRATEGY ----------------- */
export class OtpStrategy implements AuthStrategy {
  /** ----------------- SETUP / REGISTER PASSWORDLESS METHOD ----------------- */
  async setup(
    ctx: DB_RequestContext,
    payload: {
      accountId: string;
      targetId: string; 
      channel: VerificationType; 
    },
    client?: PoolClient,
  ): Promise<ServiceResponse<{ methodId: string }>> {
    try {
      const { accountId, targetId, channel } = payload;

      // 1. Validate account ownership
      const account = await repoAccount.findOne(
        { account_id: accountId },
        ctx,
        client,
      );
      if (!account || account.account_id !== ctx.accountId) {
        // TODO : Higher level can update this to allow admins to register methods for other accounts
        return { success: false, message: "Unauthorized account access" };
      }

      // 2. Check if method exists
      let method = await repoPasswordlessMethod.findOne(
        {
          account_id: accountId,
          channel,
          method_type: PASSWORDLESS_METHODS.OTP,
        },
        ctx,
        client,
      );

      if (!method) {
        // 3. Create new passwordless method record
        method = await repoPasswordlessMethod.create(
          {
            account_id: accountId,
            tenant_id: ctx.tenantId,
            method_type: PASSWORDLESS_METHODS.OTP,
            channel,
            device_info: {
              targetId,
            },
          },
          ctx,
          client,
        );
      } else {
        // If method exists but was previously deleted, restore it
        await repoPasswordlessMethod.update(
          method.method_id,
          {
            deleted_at: null,
            updated_at: new Date(),
            device_info: { targetId },
            method_type: PASSWORDLESS_METHODS.OTP,
            channel,
          },
          ctx,
          client,
        );
      }

      return {
        success: true,
        data: { methodId: method.method_id },
        message: "OTP method registered successfully",
      };
    } catch (error) {
      return { success: false, message: "Failed to register OTP method" };
    }
  }

  /** ----------------- SEND / GENERATE OTP ----------------- */
  async sendOtp(
    ctx: DB_RequestContext,
    payload: {
      accountId: string;
      methodId: string; // Which passwordless method to use
      length?: number;
      charset?: OtpCharset;
      expiresInMinutes?: number;
      cooldownSeconds?: number; // optional cooldown
    },
    client?: PoolClient,
  ): Promise<ServiceResponse<{ verificationId: string; otp?: string }>> {
    try {
      const {
        accountId,
        methodId,
        length,
        charset,
        expiresInMinutes,
        cooldownSeconds = 60, // default cooldown: 60 seconds
      } = payload;

      // 1. Confirm passwordless method exists
      const method = await repoPasswordlessMethod.findOne(
        { method_id: methodId, account_id: accountId, deleted_at: null },
        ctx,
        client,
      );
      if (!method || !method.channel || !method.device_info?.targetId) {
        return {
          success: false,
          message: `Passwordless ${method?.channel || "unknown"} method not registered properly`,
        };
      }

      const targetId = method.device_info.targetId;

      // 2. Fetch existing pending OTPs for this target/channel
      const oldOtps = await repoVerification.select(
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

      if (oldOtps.length > 0) {
        const latestOtp = oldOtps[0];
        const diffSeconds =
          (now.getTime() - new Date(latestOtp.created_at).getTime()) / 1000;

        if (diffSeconds < cooldownSeconds) {
          // Cooldown not reached
          return {
            success: false,
            message: `OTP already sent. Please wait ${Math.ceil(
              cooldownSeconds - diffSeconds,
            )} seconds before requesting a new OTP`,
          };
        } else {
          // Expire old OTPs
          for (const otp of oldOtps) {
            await repoVerification.update(
              otp.verification_id,
              { status: VERIFICATION_STATUS.EXPIRED },
              ctx,
              client,
            );
          }
        }
      }

      // 3. Generate new OTP
      const otp = generateOtp(
        length ?? DEFAULT_OTP_LENGTH,
        charset ?? OTP_CHARSET.NUMERIC,
      );
      const hashedOtp = await bcrypt.hash(otp, SALT_ROUNDS);

      // 4. Calculate expiry
      const expiryDate = new Date();
      expiryDate.setMinutes(
        expiryDate.getMinutes() +
          (expiresInMinutes ?? DEFAULT_OTP_EXPIRY_MINUTES),
      );

      // 5. Store OTP in verification table
      const record = await repoVerification.create(
        {
          tenant_id: ctx.tenantId,
          account_id: accountId,
          target_id: targetId,
          type: method.channel,
          token: hashedOtp,
          status: VERIFICATION_STATUS.PENDING,
          expires_at: expiryDate,
        },
        ctx,
        client,
      );

      // // TODO: Implement actual notification logic
      // 6. Trigger notification (assume external service)
      // await notifyOtp(method.channel, targetId, otp);

      return {
        success: true,
        data: { verificationId: record.verification_id },
        message: `OTP sent via ${method.channel}`,
      };
    } catch (error) {
      return { success: false, message: "Failed to send OTP" };
    }
  }

  /** ----------------- AUTHENTICATE / VERIFY OTP ----------------- */
  async authenticate(
    ctx: DB_RequestContext,
    payload: { accountId: string; methodId: string; otp: string },
    client?: PoolClient,
  ): Promise<ServiceResponse<{ verified: boolean }>> {
    try {
      const { accountId, methodId, otp } = payload;

      const method = await repoPasswordlessMethod.findOne(
        { method_id: methodId, account_id: accountId },
        ctx,
        client,
      );
      if (!method)
        return {
          success: false,
          message: "Passwordless method not registered",
        };

      // 1. Fetch latest pending OTP for this target
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
        return { success: false, message: "OTP not found or expired" };

      if (record.expires_at < new Date()) {
        await repoVerification.update(
          record.verification_id,
          { status: VERIFICATION_STATUS.EXPIRED },
          ctx,
          client,
        );
        return { success: false, message: "OTP expired" };
      }

      const isValid = await bcrypt.compare(otp, record.token);
      if (!isValid) return { success: false, message: "Invalid OTP" };

      await repoVerification.update(
        record.verification_id,
        { status: VERIFICATION_STATUS.VERIFIED, verified_at: new Date() },
        ctx,
        client,
      );

      return {
        success: true,
        data: { verified: true },
        message: "OTP verified successfully",
      };
    } catch {
      return { success: false, message: "OTP verification failed" };
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

      // Delete the passwordless method itself
      await repoPasswordlessMethod.delete(method.method_id, ctx, client);

      return {
        success: true,
        message: `Passwordless method ${method.channel} revoked successfully`,
        data: undefined,
      };
    } catch {
      return {
        success: false,
        message: "Failed to revoke passwordless method",
      };
    }
  }

  /** ----------------- REVOKE PENDING OTPs FOR METHOD ----------------- */
  async revokeOtpsForMethod(
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

      // Delete all pending OTPs for this target/channel
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

      for (const record of records) {
        await repoVerification.delete(record.verification_id, ctx, client);
      }

      return {
        success: true,
        message: `Pending OTPs revoked for ${method.channel}`,
        data: undefined,
      };
    } catch {
      return { success: false, message: "Failed to revoke OTPs" };
    }
  }

  /** ----------------- VERIFY (dummy for interface) ----------------- */
  async verify(): Promise<ServiceResponse<{ verified: boolean }>> {
    return { success: true, data: { verified: true } };
  }

  /** ----------------- UPDATE / MODIFY PASSWORDLESS METHOD ----------------- */
  async update(
    ctx: DB_RequestContext,
    payload: {
      accountId: string;
      methodId: string;
      newTargetId?: string; // new email or phone
      newChannel?: VerificationType; // optional, email / sms / whatsapp
    },
    client?: PoolClient,
  ): Promise<ServiceResponse<void>> {
    try {
      const { accountId, methodId, newTargetId, newChannel } = payload;

      // 1. Fetch the passwordless method
      const method = await repoPasswordlessMethod.findOne(
        { method_id: methodId, account_id: accountId, deleted_at: null },
        ctx,
        client,
      );
      if (!method)
        return { success: false, message: "Passwordless method not found" };

      // 2. Update fields
      const updates: Partial<typeof method> = {};
      if (newTargetId)
        updates.device_info = {
          ...(method.device_info || {}),
          targetId: newTargetId,
        };
      if (newChannel) updates.channel = newChannel;
      updates.updated_at = new Date();

      await repoPasswordlessMethod.update(methodId, updates, ctx, client);

      // 3. Revoke any pending OTPs for old target
      if (newTargetId || newChannel) {
        const pendingOtps = await repoVerification.select(
          {
            where: {
              account_id: accountId,
              target_id: method.device_info?.targetId,
              type: VERIFICATION_TYPE.EMAIL_OTP,
              status: VERIFICATION_STATUS.PENDING,
            },
          },
          ctx,
          client,
        );

        for (const otp of pendingOtps) {
          await repoVerification.delete(otp.verification_id, ctx, client);
        }
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
}
