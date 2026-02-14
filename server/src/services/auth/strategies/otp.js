import crypto from "crypto";
import { BaseAuthStrategy } from "./baseAuth.js";
import { authQuery } from "#queries";

const { createCredential, findActiveCredential, revokeCredential } = authQuery;

export class OtpStrategy extends BaseAuthStrategy {
  constructor() {
    super();
    this.type = "primary"; // can be primary or secondary
    this.credentialType = "otp";
    this.otpLength = 6;
    this.otpExpiryMinutes = 5; // OTP expires in 5 minutes
  }

  /* ===================================================== */
  /* SETUP - generate OTP                                   */
  /* ===================================================== */
  async setup(userId, payload, conn = null) {
    const { tenantId, channel = "email", changedBy } = payload;

    if (!tenantId || !changedBy) {
      return {
        success: false,
        code: "INVALID_INPUT",
        message: "tenantId and changedBy are required",
      };
    }

    // Generate numeric OTP
    const code = crypto
      .randomInt(0, 10 ** this.otpLength)
      .toString()
      .padStart(this.otpLength, "0");
    const expiresAt = new Date(Date.now() + this.otpExpiryMinutes * 60 * 1000);

    const result = await this.withTransaction(conn, async (trx) => {
      // Revoke any existing active OTPs for this user/channel
      const existing = await findActiveCredential(
        { tenantId, userId, credentialType: this.credentialType },
        trx,
      );
      if (existing) {
        await revokeCredential(
          { tenantId, credentialId: existing.credential_id, changedBy },
          trx,
        );
      }

      // Store new OTP in metadata
      await createCredential(
        {
          tenantId,
          userId,
          credentialType: this.credentialType,
          secretHash: null, // no hash for OTP, can hash if needed
          changedBy,
          metadata: { code, channel, expiresAt: expiresAt.toISOString() },
        },
        trx,
      );

      return {
        success: true,
        code: "OTP_CREATED",
        data: { userId, tenantId, channel, code, expiresAt },
      };
    });

    return result;
  }

  /* ===================================================== */
  /* AUTHENTICATE / VERIFY OTP                               */
  /* ===================================================== */
  async authenticate(userId, payload, conn = null) {
    const { tenantId, code, channel = "email" } = payload;

    if (!tenantId || !code) {
      return { success: false, code: "INVALID_INPUT" };
    }

    const result = await this.withTransaction(conn, async (trx) => {
      const credential = await findActiveCredential({
        tenantId,
        userId,
        credentialType: this.credentialType,
      }, trx);

      if (!credential) {
        return { success: false, code: "INVALID_OTP" };
      }

      const metadata = credential.metadata || {};
      const { code: storedCode, channel: storedChannel, expiresAt } = metadata;

      if (storedCode !== code || storedChannel !== channel) {
        return { success: false, code: "INVALID_OTP" };
      }

      if (new Date() > new Date(expiresAt)) {
        return { success: false, code: "OTP_EXPIRED" };
      }

      // Single-use → revoke OTP immediately
      await revokeCredential(
        { tenantId, credentialId: credential.credential_id, changedBy: userId },
        trx,
      );

      return {
        success: true,
        code: "AUTH_SUCCESS",
        data: {
          userId,
          tenantId,
          credentialId: credential.credential_id,
          method: this.credentialType,
          channel,
        },
      };
    });

    return result;
  }

  /* ===================================================== */
  /* UPDATE                                                */
  /* ===================================================== */
  async update() {
    return {
      success: false,
      code: "NOT_SUPPORTED",
      message: "OTP does not support update()",
    };
  }

  /* ===================================================== */
  /* REVOKE                                                */
  /* ===================================================== */
  async revoke(userId, payload, conn = null) {
    const { tenantId, changedBy } = payload;

    if (!tenantId || !changedBy) {
      return { success: false, code: "INVALID_INPUT" };
    }

    const result = await this.withTransaction(conn, async (trx) => {
      const credential = await findActiveCredential(
        { tenantId, userId, credentialType: this.credentialType },
        trx,
      );

      if (!credential) return { success: false, code: "CREDENTIAL_NOT_FOUND" };

      await revokeCredential(
        { tenantId, credentialId: credential.credential_id, changedBy },
        trx,
      );

      return { success: true, code: "OTP_REVOKED", data: { userId, tenantId } };
    });

    return result;
  }

  /* ===================================================== */
  /* VERIFY                                                */
  /* ===================================================== */
  async verify() {
    return {
      success: false,
      code: "NOT_SUPPORTED",
      message: "OTP does not support verify()",
    };
  }
}
