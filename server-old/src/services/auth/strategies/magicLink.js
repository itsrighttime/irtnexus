import crypto from "crypto";
import { BaseAuthStrategy } from "./baseAuth.js";
import { authQuery } from "#queries";

const { createCredential, findActiveCredential, revokeCredential } = authQuery;

export class MagicLinkStrategy extends BaseAuthStrategy {
  constructor() {
    super();
    this.type = "secondary";
    this.credentialType = "magic_link";
    this.linkExpiryMinutes = 15; // Link expires in 15 minutes
  }

  /* ===================================================== */
  /* SETUP - generate a magic link                         */
  /* ===================================================== */
  async setup(userId, payload, conn = null) {
    const { tenantId, changedBy } = payload;

    if (!tenantId || !changedBy) {
      return {
        success: false,
        code: "INVALID_INPUT",
        message: "tenantId and changedBy are required",
      };
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + this.linkExpiryMinutes * 60 * 1000);

    const result = await this.withTransaction(conn, async (trx) => {
      // Revoke any existing active magic links
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

      // Create new magic link credential
      await createCredential(
        {
          tenantId,
          userId,
          credentialType: this.credentialType,
          secretHash: null, // not needed
          changedBy,
          metadata: { token, expiresAt: expiresAt.toISOString() },
        },
        trx,
      );

      return {
        success: true,
        code: "MAGIC_LINK_CREATED",
        data: { userId, tenantId, token, expiresAt },
      };
    });

    return result;
  }

  /* ===================================================== */
  /* AUTHENTICATE                                          */
  /* ===================================================== */
  async authenticate(userId, payload, conn = null) {
    const { tenantId, token } = payload;

    if (!tenantId || !token) {
      return { success: false, code: "INVALID_INPUT" };
    }

    const result = await this.withTransaction(conn, async (trx) => {
      const credential = await findActiveCredential(
        {
          tenantId,
          userId,
          credentialType: this.credentialType,
        },
        trx,
      );

      if (!credential) {
        return { success: false, code: "INVALID_LINK" };
      }

      const { token: storedToken, expiresAt } = credential.metadata || {};

      if (storedToken !== token) {
        return { success: false, code: "INVALID_LINK" };
      }

      if (new Date() > new Date(expiresAt)) {
        return { success: false, code: "LINK_EXPIRED" };
      }

      // Magic link is single-use → revoke immediately
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
      message: "MagicLink does not support update()",
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

      return {
        success: true,
        code: "MAGIC_LINK_REVOKED",
        data: { userId, tenantId },
      };
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
      message: "MagicLink does not support verify()",
    };
  }
}
