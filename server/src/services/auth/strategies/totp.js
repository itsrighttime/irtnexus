import { totp } from "otplib";
import { BaseAuthStrategy } from "./baseAuth.js";
import { authQuery } from "#queries";
import { opDb } from "#database";
import { crypto } from "crypto";

const { createCredential, findActiveCredential, revokeCredential } = authQuery;

export class TotpStrategy extends BaseAuthStrategy {
  constructor() {
    super();
    this.type = "primary"; // can also be secondary in MFA
    this.credentialType = "totp";
    this.step = 30; // TOTP interval in seconds
    totp.options = { step: this.step, window: 1 }; // allow +/- 1 step drift
  }

  /* ===================================================== */
  /* SETUP - generate a TOTP secret for the user          */
  /* ===================================================== */
  async setup(userId, payload) {
    const { tenantId, changedBy, issuer = "MyApp" } = payload;

    if (!tenantId || !changedBy) {
      return {
        success: false,
        code: "INVALID_INPUT",
        message: "tenantId and changedBy are required",
      };
    }

    const secret = totp.generateSecret();

    const result = await opDb.transaction(async (conn) => {
      // Revoke existing TOTP credentials
      const existing = await findActiveCredential(
        { tenantId, userId, credentialType: this.credentialType },
        conn,
      );
      if (existing) {
        await revokeCredential(
          { tenantId, credentialId: existing.credential_id, changedBy },
          conn,
        );
      }

      // Create new TOTP credential
      await createCredential(
        {
          tenantId,
          userId,
          credentialType: this.credentialType,
          secretHash: null, // secret stored in metadata
          changedBy,
          metadata: { secret, issuer, lastUsed: null },
        },
        conn,
      );

      return {
        success: true,
        code: "TOTP_CREATED",
        data: { userId, tenantId, secret, issuer },
      };
    });

    return result;
  }

  /* ===================================================== */
  /* AUTHENTICATE - verify user-provided TOTP code        */
  /* ===================================================== */
  async authenticate(userId, payload) {
    const { tenantId, token } = payload;

    if (!tenantId || !token) {
      return { success: false, code: "INVALID_INPUT" };
    }

    const credential = await findActiveCredential({
      tenantId,
      userId,
      credentialType: this.credentialType,
    });

    if (!credential) {
      return { success: false, code: "CREDENTIAL_NOT_FOUND" };
    }

    const { secret, lastUsed } = credential.metadata || {};

    if (!secret) {
      return { success: false, code: "TOTP_NOT_SETUP" };
    }

    // Prevent reuse of same token in same interval
    if (lastUsed === token) {
      return { success: false, code: "TOTP_ALREADY_USED" };
    }

    const isValid = totp.check(token, secret);

    if (!isValid) {
      return { success: false, code: "INVALID_TOTP" };
    }

    // Update lastUsed to prevent reuse
    await opDb.transaction(async (conn) => {
      await authQuery.updateCredential(
        {
          tenantId,
          credentialId: credential.credential_id,
          data: { metadata: { ...credential.metadata, lastUsed: token } },
          changedBy: userId,
        },
        conn,
      );
    });

    return {
      success: true,
      code: "AUTH_SUCCESS",
      data: {
        userId,
        tenantId,
        credentialId: credential.credential_id,
        method: this.credentialType,
      },
    };
  }

  /* ===================================================== */
  /* UPDATE - TOTP secret rotation                        */
  /* ===================================================== */
  async update(userId, payload) {
    const { tenantId, changedBy } = payload;

    if (!tenantId || !changedBy) {
      return { success: false, code: "INVALID_INPUT" };
    }

    // Simply generate a new TOTP secret and replace existing
    const secret = totp.generateSecret();

    const result = await opDb.transaction(async (conn) => {
      const credential = await findActiveCredential(
        { tenantId, userId, credentialType: this.credentialType },
        conn,
      );

      if (!credential) {
        return { success: false, code: "CREDENTIAL_NOT_FOUND" };
      }

      await authQuery.updateCredential(
        {
          tenantId,
          credentialId: credential.credential_id,
          data: {
            metadata: { ...credential.metadata, secret, lastUsed: null },
          },
          changedBy,
        },
        conn,
      );

      return {
        success: true,
        code: "TOTP_UPDATED",
        data: { userId, tenantId, secret },
      };
    });

    return result;
  }

  /* ===================================================== */
  /* REVOKE / DELETE                                      */
  /* ===================================================== */
  async revoke(userId, payload) {
    const { tenantId, changedBy } = payload;

    if (!tenantId || !changedBy) {
      return { success: false, code: "INVALID_INPUT" };
    }

    const result = await opDb.transaction(async (conn) => {
      const credential = await findActiveCredential(
        { tenantId, userId, credentialType: this.credentialType },
        conn,
      );

      if (!credential) return { success: false, code: "CREDENTIAL_NOT_FOUND" };

      await revokeCredential(
        { tenantId, credentialId: credential.credential_id, changedBy },
        conn,
      );

      return {
        success: true,
        code: "TOTP_REVOKED",
        data: { userId, tenantId },
      };
    });

    return result;
  }

  async delete(userId, payload) {
    return this.revoke(userId, payload);
  }

  async verify() {
    return {
      success: false,
      code: "NOT_SUPPORTED",
      message: "TOTP does not support verify()",
    };
  }
}
