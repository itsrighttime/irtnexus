/**
 * EVENT_TYPES
 *
 * Enumeration of event types for observability and auditing.
 * Used to classify events in the system for logging, metrics, and audit.
 */
export const EVENT_TYPES = {
  /** Standard HTTP request successfully completed */
  REQUEST_COMPLETED: "REQUEST_COMPLETED",

  /** Standard HTTP request failed (e.g., error or exception) */
  REQUEST_FAILED: "REQUEST_FAILED",

  /** Domain-specific business events (e.g., user created, order processed) */
  BUSINESS_EVENT: "BUSINESS_EVENT",

  /** Authentication-related events (login, logout, token refresh) */
  AUTH_EVENT: "AUTH_EVENT",

  /** Authorization / access control events (permission granted/denied) */
  ACCESS_EVENT: "ACCESS_EVENT",

  /** System-level events (errors, warnings, alerts, health checks) */
  SYSTEM_EVENT: "SYSTEM_EVENT",
};
