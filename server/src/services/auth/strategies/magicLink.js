import crypto from "crypto";
import { BaseAuthStrategy } from "./baseAuth.js";
import { authQuery } from "#queries";
import { opDb } from "#database";

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
  async setup(userId, payload) {
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

    const result = await opDb.transaction(async (conn) => {
      // Revoke any existing active magic links
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
        conn,
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
    await opDb.transaction(async (conn) => {
      await revokeCredential(
        { tenantId, credentialId: credential.credential_id, changedBy: userId },
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
