import { BaseAuthStrategy } from "./baseAuth.js";
import { authQuery } from "#queries";

const {
  createCredential,
  findActiveCredential,
  revokeCredential,
  updateCredential,
} = authQuery;

export class FederatedIdentityStrategy extends BaseAuthStrategy {
  constructor() {
    super();
    this.type = "primary"; // can be primary authentication
    this.credentialType = "federated_identity";
  }

  /* ===================================================== */
  /* SETUP - register federated identity                  */
  /* ===================================================== */
  async setup(userId, payload, conn = null) {
    const { tenantId, provider, externalUserId, changedBy } = payload;

    if (!tenantId || !provider || !externalUserId || !changedBy) {
      return {
        success: false,
        code: "INVALID_INPUT",
        message:
          "tenantId, provider, externalUserId, and changedBy are required",
      };
    }

    const result = await this.withTransaction(conn, async (trx) => {
      // Revoke existing federated identity for this provider
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

      // Create new federated identity credential
      await createCredential(
        {
          tenantId,
          userId,
          credentialType: this.credentialType,
          changedBy,
          metadata: { provider, externalUserId },
        },
        trx,
      );

      return {
        success: true,
        code: "FEDERATED_IDENTITY_CREATED",
        data: { userId, tenantId, provider, externalUserId },
      };
    });

    return result;
  }

  /* ===================================================== */
  /* AUTHENTICATE - validate federated login              */
  /* ===================================================== */
  async authenticate(userId, payload, conn = null) {
    const { tenantId, provider, externalUserId } = payload;

    if (!tenantId || !provider || !externalUserId) {
      return { success: false, code: "INVALID_INPUT" };
    }

    const credential = await findActiveCredential({
      tenantId,
      userId,
      credentialType: this.credentialType,
    }, conn);

    if (!credential) {
      return { success: false, code: "CREDENTIAL_NOT_FOUND" };
    }

    const metadata = credential.metadata || {};
    if (
      metadata.provider !== provider ||
      metadata.externalUserId !== externalUserId
    ) {
      return { success: false, code: "INVALID_CREDENTIALS" };
    }

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
  /* UPDATE - update federated identity mapping          */
  /* ===================================================== */
  async update(userId, payload, conn = null) {
    const { tenantId, provider, externalUserId, changedBy } = payload;

    if (!tenantId || !provider || !externalUserId || !changedBy) {
      return { success: false, code: "INVALID_INPUT" };
    }

    const result = await this.withTransaction(conn, async (trx) => {
      const credential = await findActiveCredential(
        { tenantId, userId, credentialType: this.credentialType },
        trx,
      );
      if (!credential) return { success: false, code: "CREDENTIAL_NOT_FOUND" };

      await updateCredential(
        {
          tenantId,
          credentialId: credential.credential_id,
          data: { metadata: { provider, externalUserId } },
          changedBy,
        },
        trx,
      );

      return {
        success: true,
        code: "FEDERATED_IDENTITY_UPDATED",
        data: { userId, tenantId, provider, externalUserId },
      };
    });

    return result;
  }

  /* ===================================================== */
  /* REVOKE / DELETE                                     */
  /* ===================================================== */
  async revoke(userId, payload, conn = null) {
    const { tenantId, changedBy } = payload;

    if (!tenantId || !changedBy)
      return { success: false, code: "INVALID_INPUT" };

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
        code: "FEDERATED_IDENTITY_REVOKED",
        data: { userId, tenantId },
      };
    });

    return result;
  }

  async verify() {
    return {
      success: false,
      code: "NOT_SUPPORTED",
      message: "Federated identity does not support verify()",
    };
  }
}
