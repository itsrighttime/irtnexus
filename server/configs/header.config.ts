/**
 * Standard HTTP Headers used across the application
 *
 * Centralized definition of commonly used custom and standard headers.
 * Helps maintain consistency and reduces typos when accessing headers.
 */
export const HEADERS = {
  /** Custom header to indicate the user's language preference */
  LANGUAGE: "x-language",

  /** W3C Trace Context header for distributed tracing */
  TRACEPARENT: "traceparent",

  /** Standard User-Agent header identifying the client making the request */
  USER_AGENT: "user-agent",

  /** Standard header indicating the content type of the request or response */
  CONTENT_TYPE: "content-type",

  /** Custom header to identify the tenant in multi-tenant applications */
  TENANT_ID: "x-tenant-id",
  AUTHORIZATION: "authorization",
} as const;
