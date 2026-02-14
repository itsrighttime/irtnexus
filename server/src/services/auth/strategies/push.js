import { BaseAuthStrategy } from "./baseAuth.js";
import { authQuery } from "#queries";

const {
  createCredential,
  findActiveCredential,
  revokeCredential,
  updateCredential,
} = authQuery;

export class PushStrategy extends BaseAuthStrategy {
  constructor() {
    super();
    this.type = "secondary"; // push often used as step-up factor
    this.credentialType = "push";
  }

  /* ===================================================== */
  /* SETUP - register a push device for user             */
  /* ===================================================== */
  async setup(userId, payload, conn = null) {
    const { tenantId, deviceToken, changedBy, deviceName, platform } = payload;

    if (!tenantId || !deviceToken || !changedBy) {
      return {
        success: false,
        code: "INVALID_INPUT",
        message: "tenantId, deviceToken, changedBy are required",
      };
    }

    const result = await this.withTransaction(conn, async (trx) => {
      // Revoke existing active push credential
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

      // Create new push credential
      await createCredential(
        {
          tenantId,
          userId,
          credentialType: this.credentialType,
          changedBy,
          metadata: {
            deviceToken,
            deviceName,
            platform,
            lastPushAt: null,
            status: "active",
          },
        },
        trx,
      );

      return {
        success: true,
        code: "PUSH_CREATED",
        data: { userId, tenantId, deviceName, platform },
      };
    });

    return result;
  }

  /* ===================================================== */
  /* AUTHENTICATE - trigger push notification            */
  /* ===================================================== */
  async authenticate(userId, payload, conn = null) {
    const { tenantId, deviceToken } = payload;

    if (!tenantId || !deviceToken) {
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
        return { success: false, code: "CREDENTIAL_NOT_FOUND" };
      }

      const metadata = credential.metadata || {};

      if (
        metadata.deviceToken !== deviceToken ||
        metadata.status !== "active"
      ) {
        return { success: false, code: "INVALID_CREDENTIALS" };
      }

      // Simulate push notification sent
      const now = new Date().toISOString();
      await updateCredential(
        {
          tenantId,
          credentialId: credential.credential_id,
          data: { metadata: { ...metadata, lastPushAt: now } },
          changedBy: userId,
        },
        trx,
      );

      return {
        success: true,
        code: "PUSH_TRIGGERED",
        message: "Push notification sent, waiting for approval",
        data: { userId, tenantId, credentialId: credential.credential_id },
      };
    });

    return result;
  }

  /* ===================================================== */
  /* VERIFY - user approves push                          */
  /* ===================================================== */
  async verify(userId, payload, conn = null) {
    const { tenantId, deviceToken } = payload;

    if (!tenantId || !deviceToken) {
      return { success: false, code: "INVALID_INPUT" };
    }

    const credential = await findActiveCredential(
      {
        tenantId,
        userId,
        credentialType: this.credentialType,
      },
      conn,
    );

    if (!credential) {
      return { success: false, code: "CREDENTIAL_NOT_FOUND" };
    }

    const metadata = credential.metadata || {};

    if (metadata.deviceToken !== deviceToken || metadata.status !== "active") {
      return { success: false, code: "INVALID_CREDENTIALS" };
    }

    // Simulate approval (in real implementation, integrate with push service)
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
  /* UPDATE - update device info                           */
  /* ===================================================== */
  async update(userId, payload, conn = null) {
    const { tenantId, deviceToken, deviceName, platform, changedBy } = payload;

    if (!tenantId || !deviceToken || !changedBy) {
      return { success: false, code: "INVALID_INPUT" };
    }

    const result = await this.withTransaction(conn, async (trx) => {
      const credential = await findActiveCredential(
        { tenantId, userId, credentialType: this.credentialType },
        trx,
      );

      if (!credential) return { success: false, code: "CREDENTIAL_NOT_FOUND" };

      const metadata = {
        ...credential.metadata,
        deviceToken,
        deviceName,
        platform,
      };

      await updateCredential(
        {
          tenantId,
          credentialId: credential.credential_id,
          data: { metadata },
          changedBy,
        },
        trx,
      );

      return {
        success: true,
        code: "PUSH_UPDATED",
        data: { userId, tenantId, deviceName, platform },
      };
    });

    return result;
  }

  /* ===================================================== */
  /* REVOKE / DELETE                                     */
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
        code: "PUSH_REVOKED",
        data: { userId, tenantId },
      };
    });

    return result;
  }
}
