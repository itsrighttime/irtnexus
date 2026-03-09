/**
 * ACTION constants
 *
 * Centralized definitions for action types and action names used across the application.
 * Useful for logging, auditing, and categorizing different kinds of operations.
 */
export const ACTION = {
  /**
   * TYPE: Categories of actions
   *
   * - AUTH: Authentication-related actions (login, logout, OTP, etc.)
   * - BUSINESS: Core business logic actions
   * - ACCESS: Permissions or access control actions
   * - SYSTEM: System-level operations (internal events, system health)
   * - LOG: Logging or monitoring actions
   */
  TYPE: {
    AUTH: "auth",
    BUSINESS: "business",
    ACCESS: "access",
    SYSTEM: "system",
    LOG: "log",
    ENTITY: "entity",
  },

  /**
   * NAME: Specific action names
   *
   * These represent specific operations in the application for detailed logging or tracking.
   * - REGISTER_SEND_OTP: Sending OTP during registration
   * - REGISTER_VERIFY_OTP: Verifying OTP during registration
   * - LOG: Generic log action
   */
  NAME: {
    REGISTER_SEND_OTP: "Register Send OTP",
    REGISTER_VERIFY_OTP: "Register Verify OTP",
    LOG: "Log",
    ENTITY_CREATION: "Entity Creation",
    ENTITY_UPDATE: "Entity Update",
    ENTITY_GET: "Entity get",
    ENTITY_GET_ALL: "Entity get all",
    ENTITY_REL_ADD: "Adding a new entity relationship",
    ENTITY_REL_UPDATE: "Adding a new entity relationship",
  },
};
