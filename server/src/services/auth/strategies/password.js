import bcrypt from "bcrypt";
import { BaseAuthStrategy } from "./baseAuth.js";
import { authQuery } from "#queries";
import { opDb } from "#database";

const {
  createCredential,
  findActiveCredential,
  updateCredential,
  revokeCredential,
} = authQuery;

export class PasswordStrategy extends BaseAuthStrategy {
  constructor() {
    super();
    this.type = "primary";
    this.saltRounds = 12;
    this.credentialType = "password";
  }

  /* ===================================================== */
  /* SETUP                                                 */
  /* ===================================================== */

  async setup(userId, payload) {
    const { tenantId, password, changedBy } = payload;

    if (!tenantId || !password || !changedBy) {
      return {
        success: false,
        code: "INVALID_INPUT",
        message: "tenantId, password and changedBy are required",
      };
    }

    const validation = this.#validatePasswordStrength(password);
    if (!validation.success) return validation;

    const passwordHash = await bcrypt.hash(password, this.saltRounds);

    const result = await opDb.transaction(async (conn) => {
      const existing = await findActiveCredential(
        {
          tenantId,
          userId,
          credentialType: this.credentialType,
        },
        conn,
      );

      if (existing) {
        await revokeCredential(
          {
            tenantId,
            credentialId: existing.credential_id,
            changedBy,
          },
          conn,
        );
      }

      await createCredential(
        {
          tenantId,
          userId,
          credentialType: this.credentialType,
          secretHash: passwordHash,
          changedBy,
        },
        conn,
      );
      return {
        success: true,
        code: "PASSWORD_CREATED",
        data: { userId, tenantId },
      };
    });

    return result;
  }

  /* ===================================================== */
  /* AUTHENTICATE                                          */
  /* ===================================================== */

  async authenticate(userId, payload) {
    const { tenantId, password } = payload;

    if (!tenantId || !password) {
      return {
        success: false,
        code: "INVALID_INPUT",
      };
    }

    const credential = await findActiveCredential({
      tenantId,
      userId: userId,
      credentialType: this.credentialType,
    });

    if (!credential) {
      return {
        success: false,
        code: "INVALID_CREDENTIALS",
      };
    }

    const isMatch = await bcrypt.compare(password, credential.secret_hash);

    if (!isMatch) {
      return {
        success: false,
        code: "INVALID_CREDENTIALS",
      };
    }

    return {
      success: true,
      code: "AUTH_SUCCESS",
      data: {
        userId: userId,
        tenantId,
        credentialId: credential.credential_id,
        method: this.credentialType,
      },
    };
  }

  /* ===================================================== */
  /* UPDATE                                                */
  /* ===================================================== */

  async update(userId, payload) {
    const { tenantId, oldPassword, newPassword, changedBy } = payload;

    if (!tenantId || !oldPassword || !newPassword || !changedBy) {
      return {
        success: false,
        code: "INVALID_INPUT",
      };
    }

    const result = await opDb.transaction(async (conn) => {
      const credential = await findActiveCredential(
        {
          tenantId,
          userId,
          credentialType: this.credentialType,
        },
        conn,
      );

      if (!credential) {
        return {
          success: false,
          code: "CREDENTIAL_NOT_FOUND",
        };
      }

      const isMatch = await bcrypt.compare(oldPassword, credential.secret_hash);

      if (!isMatch) {
        return {
          success: false,
          code: "INVALID_OLD_PASSWORD",
        };
      }

      const validation = this.#validatePasswordStrength(newPassword);
      if (!validation.success) return validation;

      const newHash = await bcrypt.hash(newPassword, this.saltRounds);

      await updateCredential(
        {
          tenantId,
          credentialId: credential.credential_id,
          data: { secret_hash: newHash },
          changedBy,
        },
        conn,
      );

      return {
        success: true,
        code: "PASSWORD_UPDATED",
        data: { userId, tenantId },
      };
    });
    return result;
  }

  /* ===================================================== */
  /* REVOKE                                                */
  /* ===================================================== */

  async revoke(userId, payload) {
    const { tenantId, changedBy } = payload;

    if (!tenantId || !changedBy) {
      return {
        success: false,
        code: "INVALID_INPUT",
      };
    }

    const result = await opDb.transaction(async (conn) => {
      const credential = await findActiveCredential(
        {
          tenantId,
          userId,
          credentialType: this.credentialType,
        },
        conn,
      );

      if (!credential) {
        return {
          success: false,
          code: "CREDENTIAL_NOT_FOUND",
        };
      }

      await revokeCredential(
        {
          tenantId,
          credentialId: credential.credential_id,
          changedBy,
        },
        conn,
      );

      return {
        success: true,
        code: "PASSWORD_REVOKED",
        data: { userId, tenantId },
      };
    });
    return result;
  }

  async verify() {
    return {
      success: false,
      code: "NOT_SUPPORTED",
      message: "Password does not support verify()",
    };
  }

  /* ===================================================== */
  /* PRIVATE VALIDATION                                    */
  /* ===================================================== */

  #validatePasswordStrength(password) {
    if (password.length < 8) {
      return { success: false, code: "PASSWORD_TOO_SHORT" };
    }
    if (!/[A-Z]/.test(password)) {
      return { success: false, code: "PASSWORD_NO_UPPERCASE" };
    }
    if (!/[a-z]/.test(password)) {
      return { success: false, code: "PASSWORD_NO_LOWERCASE" };
    }
    if (!/[0-9]/.test(password)) {
      return { success: false, code: "PASSWORD_NO_NUMBER" };
    }

    return { success: true };
  }
}
