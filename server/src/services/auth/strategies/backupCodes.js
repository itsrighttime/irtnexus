import bcrypt from "bcrypt";
import { BaseAuthStrategy } from "./baseAuth.js";
import { authQuery } from "#queries";
import { opDb } from "#database";
import { generateBinaryUUID } from "#utils";

const {
  createCredential,
  findActiveCredential,
  updateCredential,
  revokeCredential,
} = authQuery;

export class BackupCodesStrategy extends BaseAuthStrategy {
  constructor() {
    super();
    this.type = "secondary"; // MFA fallback
    this.credentialType = "backup_codes";
    this.saltRounds = 12;
  }

  /* ===================================================== */
  /* SETUP - create backup codes for user                 */
  /* ===================================================== */
  async setup(userId, payload) {
    const { tenantId, codes = [], changedBy } = payload;

    if (!tenantId || !changedBy || codes.length === 0) {
      return {
        success: false,
        code: "INVALID_INPUT",
        message: "tenantId, codes, and changedBy are required",
      };
    }

    const hashedCodes = await Promise.all(
      codes.map((c) => bcrypt.hash(c, this.saltRounds)),
    );

    const result = await opDb.transaction(async (conn) => {
      // Revoke any existing backup codes
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

      // Store new backup codes in metadata
      await createCredential(
        {
          tenantId,
          userId,
          credentialType: this.credentialType,
          changedBy,
          metadata: {
            codes: hashedCodes.map((h) => ({ hash: h, used: false })),
          },
        },
        conn,
      );

      return {
        success: true,
        code: "BACKUP_CODES_CREATED",
        data: { userId, tenantId, totalCodes: codes.length },
      };
    });

    return result;
  }

  /* ===================================================== */
  /* AUTHENTICATE - use a backup code                     */
  /* ===================================================== */
  async authenticate(userId, payload) {
    const { tenantId, code } = payload;

    if (!tenantId || !code) {
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
    const codes = metadata.codes || [];

    // Find first unused code that matches
    let matchedIndex = -1;
    for (let i = 0; i < codes.length; i++) {
      if (!codes[i].used && (await bcrypt.compare(code, codes[i].hash))) {
        matchedIndex = i;
        break;
      }
    }

    if (matchedIndex === -1) {
      return { success: false, code: "INVALID_CODE" };
    }

    // Mark code as used
    codes[matchedIndex].used = true;
    await opDb.transaction(async (conn) => {
      await updateCredential(
        {
          tenantId,
          credentialId: credential.credential_id,
          data: { metadata: { ...metadata, codes } },
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
  /* UPDATE - replace backup codes entirely              */
  /* ===================================================== */
  async update(userId, payload) {
    const { tenantId, codes = [], changedBy } = payload;

    if (!tenantId || !changedBy || codes.length === 0) {
      return { success: false, code: "INVALID_INPUT" };
    }

    const hashedCodes = await Promise.all(
      codes.map((c) => bcrypt.hash(c, this.saltRounds)),
    );

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
          data: {
            metadata: {
              codes: hashedCodes.map((h) => ({ hash: h, used: false })),
            },
          },
          changedBy,
        },
        conn,
      );

      return {
        success: true,
        code: "BACKUP_CODES_UPDATED",
        data: { userId, tenantId, totalCodes: codes.length },
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

      return {
        success: true,
        code: "BACKUP_CODES_REVOKED",
        data: { userId, tenantId },
      };
    });

    return result;
  }


  async verify() {
    return {
      success: false,
      code: "NOT_SUPPORTED",
      message: "Backup codes do not support verify()",
    };
  }
}
