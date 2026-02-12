import { DatabaseFactory } from "#database";

/**
 * Default operational database connection for user-related queries.
 * Can be overridden by passing a transaction/connection explicitly.
 */
const opDb = DatabaseFactory.userOp();

/**
 * Returns the default user database connection.
 *
 * @returns {Object} Database connection instance
 */
export const getDbOpUser = () => {
  return opDb;
};

/**
 * Creates a new user record.
 *
 * @param {Object} params
 * @param {string} params.userId - Unique user identifier
 * @param {string} params.username - Unique username
 * @param {string} [params.status="active"] - User status
 * @param {string} [params.identityLevel="L0"] - Identity verification level
 * @param {string|null} [params.profileUrl=null] - Profile image URL
 * @param {string|null} [params.preferredLanguage=null] - Preferred language code
 * @param {string|null} [params.preferredTimezone=null] - Preferred timezone
 * @param {Object|null} conn - Optional DB connection (for transactions)
 *
 * @returns {Promise<any>} Database execution result
 */
export const createUser = async (
  {
    userId,
    username,
    status = "active",
    identityLevel = "L0",
    profileUrl = null,
    preferredLanguage = null,
    preferredTimezone = null,
  },
  conn = null,
) => {
  // Use provided connection (e.g. transaction) or fallback to default
  const db = conn ?? opDb;

  const sql = `
    INSERT INTO users
    (user_id, username, status, identity_level, profile_url, preferred_language, preferred_timezone)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  return db.execute(sql, [
    userId,
    username,
    status,
    identityLevel,
    profileUrl,
    preferredLanguage,
    preferredTimezone,
  ]);
};

/**
 * Creates a user name entry (supports multiple name types per user).
 *
 * @param {Object} params
 * @param {string} params.nameId - Unique name record ID
 * @param {string} params.userId - Associated user ID
 * @param {string} params.fullName - Full name value
 * @param {string} params.nameType - Type of name (e.g. legal, display)
 * @param {Object|null} conn - Optional DB connection
 *
 * @returns {Promise<any>} Database execution result
 */
export const createUserName = async (
  { nameId, userId, fullName, nameType },
  conn = null,
) => {
  const db = conn ?? opDb;

  const sql = `
    INSERT INTO user_names (name_id, user_id, full_name, name_type)
    VALUES (?, ?, ?, ?)
  `;

  return db.execute(sql, [nameId, userId, fullName, nameType]);
};

/**
 * Creates a user email record.
 *
 * @param {Object} params
 * @param {string} params.emailId - Unique email record ID
 * @param {string} params.userId - Associated user ID
 * @param {string} params.email - Email address
 * @param {boolean} params.isPrimary - Whether this is the primary email
 * @param {boolean} params.isVerify - Whether the email is verified
 * @param {Object|null} conn - Optional DB connection
 *
 * @returns {Promise<any>} Database execution result
 */
export const createUserEmail = async (
  { emailId, userId, email, isPrimary, isVerify },
  conn = null,
) => {
  const db = conn ?? opDb;

  const sql = `
    INSERT INTO user_emails (email_id, user_id, email, is_primary, verified)
    VALUES (?, ?, ?, ?, ?)
  `;

  return db.execute(sql, [emailId, userId, email, isPrimary, isVerify]);
};

/**
 * Fetches a user email record by email address.
 * Soft-deleted records are excluded.
 *
 * @param {string} email - Email address to search for
 * @param {Object|null} conn - Optional DB connection
 *
 * @returns {Promise<Object|undefined>} User email record or undefined
 */
export const getUserByEmail = async (email, conn = null) => {
  const db = conn ?? opDb;

  const rows = await db.execute(
    `SELECT * FROM user_emails WHERE email = ? AND is_deleted = FALSE`,
    [email],
  );

  return rows[0];
};

/**
 * Fetches a user record by username.
 * Soft-deleted users are excluded.
 *
 * @param {string} username - Username to search for
 * @param {Object|null} conn - Optional DB connection
 *
 * @returns {Promise<Object|undefined>} User record or undefined
 */
export const getUserByUsername = async (username, conn = null) => {
  const db = conn ?? opDb;

  const rows = await db.execute(
    `SELECT * FROM users WHERE username = ? AND is_deleted = FALSE`,
    [username],
  );

  return rows[0];
};
