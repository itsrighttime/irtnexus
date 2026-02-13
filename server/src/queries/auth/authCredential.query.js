import { mutateWithAudit, opDb } from "#database";
import { extractRows, generateBinaryUUID } from "#utils";

/* ===================================================== */
/* ==================== READS ========================== */
/* ===================================================== */

export const findActiveCredential = async (
  { tenantId, userId, credentialType },
  conn = null,
) => {
  const db = conn ?? opDb();

  const sql = `
    SELECT *
    FROM auth_credentials
    WHERE tenant_id = ?
      AND user_id = ?
      AND credential_type = ?
      AND is_deleted = FALSE
      AND is_active = TRUE
    LIMIT 1
  `;

  const rows = await db.execute(sql, [tenantId, userId, credentialType]);

  return extractRows(rows);
};

export const findCredentialById = async ({ credentialId }, conn = null) => {
  const db = conn ?? opDb();

  const sql = `
    SELECT *
    FROM auth_credentials
    WHERE credential_id = ?
    LIMIT 1
  `;

  const rows = await db.execute(sql, [credentialId]);
  return extractRows(rows);
};

export const findActiveCredentialsByType = async (
  { tenantId, userId, credentialType },
  conn = null,
) => {
  const db = conn ?? opDb();

  const sql = `
    SELECT *
    FROM auth_credentials
    WHERE tenant_id = ?
      AND user_id = ?
      AND credential_type = ?
      AND is_deleted = FALSE
      AND is_active = TRUE
  `;

  const rows = await db.execute(sql, [tenantId, userId, credentialType]);

  return extractRows(rows);
};

/* ===================================================== */
/* ==================== WRITES ========================= */
/* ===================================================== */

export const createCredential = async (
  {
    tenantId,
    userId,
    credentialType,
    secretHash = null,
    publicKey = null,
    metadata = null,
    expiresAt = null,
    changedBy,
  },
  conn = null,
) => {
  const credentialId = generateBinaryUUID();

  return mutateWithAudit(
    {
      action: "create",
      table: "auth_credentials",
      historyTable: "auth_credentials_history",
      idField: "credential_id",
      idValue: credentialId,
      tenantId,
      changedBy,
      data: {
        user_id: userId,
        credential_type: credentialType,
        secret_hash: secretHash,
        public_key: publicKey,
        metadata,
        expires_at: expiresAt,
        is_active: true,
        is_deleted: false,
      },
    },
    conn,
  );
};

export const updateCredential = async (
  { tenantId, credentialId, data, changedBy },
  conn = null,
) => {
  return mutateWithAudit(
    {
      action: "update",
      table: "auth_credentials",
      historyTable: "auth_credentials_history",
      idField: "credential_id",
      idValue: credentialId,
      tenantId,
      changedBy,
      data,
    },
    conn,
  );
};

export const revokeCredential = async (
  { tenantId, credentialId, changedBy },
  conn,
) => {
  return mutateWithAudit(
    {
      action: "delete",
      table: "auth_credentials",
      historyTable: "auth_credentials_history",
      idField: "credential_id",
      idValue: credentialId,
      tenantId,
      changedBy,
    },
    conn,
  );
};
