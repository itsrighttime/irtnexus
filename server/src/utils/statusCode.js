export const HTTP_STATUS = {
  // =========================
  // 1xx - Informational (rare in REST)
  // =========================
  x1_CONTINUE: 100, // 100 Continue - large uploads
  x1_SWITCHING_PROTOCOLS: 101, // 101 Switching Protocols - WebSocket upgrade
  x1_PROCESSING: 102, // 102 Processing - long-running request
  x1_EARLY_HINTS: 103, // 103 Early Hints - preload resources

  // =========================
  // 2xx - Success
  // =========================
  x2_OK: 200, // GET /resource success
  x2_CREATED: 201, // POST /resource success
  x2_ACCEPTED: 202, // 202 Accepted - async tasks
  x2_NON_AUTHORITATIVE_INFO: 203, // Rare
  x2_NO_CONTENT: 204, // DELETE /resource success
  x2_RESET_CONTENT: 205, // Reset UI/form
  x2_PARTIAL_CONTENT: 206, // Pagination/streaming
  x2_MULTI_STATUS: 207, // Bulk operations
  x2_ALREADY_REPORTED: 208, // WebDAV
  x2_IM_USED: 226, // Rare

  // =========================
  // 3xx - Redirection
  // =========================
  x3_MULTIPLE_CHOICES: 300, // Rare
  x3_MOVED_PERMANENTLY: 301, // Endpoint migration
  x3_FOUND: 302, // Temporary redirect
  x3_SEE_OTHER: 303, // Redirect after POST
  x3_NOT_MODIFIED: 304, // Caching (ETag)
  x3_TEMPORARY_REDIRECT: 307, // Preserve method
  x3_PERMANENT_REDIRECT: 308, // Permanent redirect

  // =========================
  // 4xx - Client errors
  // =========================
  x4_BAD_REQUEST: 400, // Invalid input
  x4_UNAUTHORIZED: 401, // Missing/invalid auth
  x4_PAYMENT_REQUIRED: 402, // Rare
  x4_FORBIDDEN: 403, // Authenticated but not allowed
  x4_NOT_FOUND: 404, // Invalid resource
  x4_METHOD_NOT_ALLOWED: 405, // Wrong HTTP method
  x4_NOT_ACCEPTABLE: 406, // Content negotiation
  x4_PROXY_AUTH_REQUIRED: 407, // Rare
  x4_REQUEST_TIMEOUT: 408, // Client timeout
  x4_CONFLICT: 409, // Duplicate/conflicting data
  x4_GONE: 410, // Resource permanently removed
  x4_LENGTH_REQUIRED: 411, // Missing Content-Length
  x4_PRECONDITION_FAILED: 412, // Conditional requests
  x4_PAYLOAD_TOO_LARGE: 413, // Request too big
  x4_URI_TOO_LONG: 414, // URI exceeded limit
  x4_UNSUPPORTED_MEDIA_TYPE: 415, // Wrong Content-Type
  x4_RANGE_NOT_SATISFIABLE: 416, // Byte range invalid
  x4_EXPECTATION_FAILED: 417, // Expect header failed
  x4_IM_A_TEAPOT: 418, // Joke
  x4_UNPROCESSABLE_ENTITY: 422, // Validation error
  x4_LOCKED: 423, // Resource locked
  x4_FAILED_DEPENDENCY: 424, // WebDAV
  x4_TOO_EARLY: 425, // Rare
  x4_UPGRADE_REQUIRED: 426, // Upgrade header required
  x4_PRECONDITION_REQUIRED: 428, // Conditional request required
  x4_TOO_MANY_REQUESTS: 429, // Rate limit exceeded
  x4_REQUEST_HEADER_FIELDS_TOO_LARGE: 431, // Headers too big
  x4_UNAVAILABLE_FOR_LEGAL_REASONS: 451, // GDPR / legal block

  // =========================
  // 5xx - Server errors
  // =========================
  x5_INTERNAL_SERVER_ERROR: 500, // Unexpected server error
  x5_NOT_IMPLEMENTED: 501, // Feature not implemented
  x5_BAD_GATEWAY: 502, // Upstream service failed
  x5_SERVICE_UNAVAILABLE: 503, // Maintenance / overload
  x5_GATEWAY_TIMEOUT: 504, // Upstream timeout
  x5_HTTP_VERSION_NOT_SUPPORTED: 505, // Version unsupported
  x5_VARIANT_ALSO_NEGOTIATES: 506, // Rare
  x5_INSUFFICIENT_STORAGE: 507, // WebDAV / storage full
  x5_LOOP_DETECTED: 508, // WebDAV
  x5_NOT_EXTENDED: 510, // Rare
  x5_NETWORK_AUTH_REQUIRED: 511, // Captive portal
};
