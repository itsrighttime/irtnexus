import { BaseAuthStrategy } from "./baseAuth.js";
import { authQuery } from "#queries";
import { opDb } from "#database";
import { generateBinaryUUID } from "#utils";

const {
  createCredential,
  findActiveCredential,
  revokeCredential,
  updateCredential,
} = authQuery;

export class SsoStrategy extends BaseAuthStrategy {
  constructor() {
    super();
    this.type = "primary"; // SSO is typically primary
    this.credentialType = "sso";
  }

  /* ===================================================== */
  /* SETUP - register SSO identity for user              */
  /* ===================================================== */
  async setup(userId, payload) {
    const { tenantId, idp, externalUserId, changedBy } = payload;

    if (!tenantId || !idp || !externalUserId || !changedBy) {
      return {
        success: false,
        code: "INVALID_INPUT",
        message: "tenantId, idp, externalUserId, changedBy are required",
      };
    }

    const result = await opDb.transaction(async (conn) => {
      // Revoke existing SSO credential for this IDP
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

      // Create new SSO credential
      await createCredential(
        {
          tenantId,
          userId,
          credentialType: this.credentialType,
          changedBy,
          metadata: { idp, externalUserId },
        },
        conn,
      );

      return {
        success: true,
        code: "SSO_REGISTERED",
        data: { userId, tenantId, idp, externalUserId },
      };
    });

    return result;
  }

  /* ===================================================== */
  /* AUTHENTICATE - verify SSO login                     */
  /* ===================================================== */
  async authenticate(userId, payload) {
    const { tenantId, idp, externalUserId } = payload;

    if (!tenantId || !idp || !externalUserId) {
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

    const metadata = credential.metadata || {};
    if (metadata.idp !== idp || metadata.externalUserId !== externalUserId) {
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
  /* UPDATE - update SSO mapping                          */
  /* ===================================================== */
  async update(userId, payload) {
    const { tenantId, idp, externalUserId, changedBy } = payload;

    if (!tenantId || !idp || !externalUserId || !changedBy) {
      return { success: false, code: "INVALID_INPUT" };
    }

    const result = await opDb.transaction(async (conn) => {
      const credential = await findActiveCredential(
        { tenantId, userId, credentialType: this.credentialType },
        conn,
      );
      if (!credential) return { success: false, code: "CREDENTIAL_NOT_FOUND" };

      await updateCredential(
        {
          tenantId,
          credentialId: credential.credential_id,
          data: { metadata: { idp, externalUserId } },
          changedBy,
        },
        conn,
      );

      return {
        success: true,
        code: "SSO_UPDATED",
        data: { userId, tenantId, idp, externalUserId },
      };
    });

    return result;
  }

  /* ===================================================== */
  /* REVOKE / DELETE                                     */
  /* ===================================================== */
  async revoke(userId, payload) {
    const { tenantId, changedBy } = payload;

    if (!tenantId || !changedBy)
      return { success: false, code: "INVALID_INPUT" };

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

      return { success: true, code: "SSO_REVOKED", data: { userId, tenantId } };
    });

    return result;
  }

  async verify() {
    return {
      success: false,
      code: "NOT_SUPPORTED",
      message: "SSO does not support verify()",
    };
  }
}
