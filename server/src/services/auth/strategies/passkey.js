import { BaseAuthStrategy } from "./baseAuth.js";
import { authQuery } from "#queries";
import { opDb } from "#database";

const { createCredential, findActiveCredential, revokeCredential } = authQuery;

export class PasskeyStrategy extends BaseAuthStrategy {
  constructor() {
    super();
    this.type = "primary"; // can also be secondary in MFA
    this.credentialType = "passkey";
  }

  /* ===================================================== */
  /* SETUP - register a new passkey credential            */
  /* ===================================================== */
  async setup(userId, payload) {
    const { tenantId, publicKey, changedBy, deviceName, userHandle, rpId } =
      payload;

    if (!tenantId || !publicKey || !changedBy || !userHandle || !rpId) {
      return {
        success: false,
        code: "INVALID_INPUT",
        message:
          "tenantId, publicKey, userHandle, rpId and changedBy are required",
      };
    }

    const result = await opDb.transaction(async (conn) => {
      // Revoke any existing active passkeys for this user
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

      // Create new passkey credential
      await createCredential(
        {
          tenantId,
          userId,
          credentialType: this.credentialType,
          publicKey,
          changedBy,
          metadata: { deviceName, userHandle, rpId },
        },
        conn,
      );

      return {
        success: true,
        code: "PASSKEY_CREATED",
        data: { userId, tenantId, deviceName, userHandle, rpId },
      };
    });

    return result;
  }

  /* ===================================================== */
  /* AUTHENTICATE - verify user using public key          */
  /* ===================================================== */
  async authenticate(userId, payload) {
    const { tenantId, publicKey, userHandle } = payload;

    if (!tenantId || !publicKey || !userHandle) {
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

    // Simple verification: publicKey and userHandle must match
    if (
      credential.public_key !== publicKey ||
      metadata.userHandle !== userHandle
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
        deviceName: metadata.deviceName,
        rpId: metadata.rpId,
      },
    };
  }

  /* ===================================================== */
  /* UPDATE - not supported for passkeys                   */
  /* ===================================================== */
  async update() {
    return {
      success: false,
      code: "NOT_SUPPORTED",
      message: "Passkey does not support update()",
    };
  }

  /* ===================================================== */
  /* REVOKE - deactivate a passkey                          */
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
        code: "PASSKEY_REVOKED",
        data: { userId, tenantId },
      };
    });

    return result;
  }

  /* ===================================================== */
  /* DELETE - alias for revoke                              */
  /* ===================================================== */
  async delete(userId, payload) {
    return this.revoke(userId, payload);
  }

  async verify() {
    return {
      success: false,
      code: "NOT_SUPPORTED",
      message: "Passkey does not support verify()",
    };
  }
}
