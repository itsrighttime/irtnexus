CREATE TABLE IF NOT EXISTS audit_logs (
  id BINARY(16) PRIMARY KEY,
  tenant_id BINARY(16) NULL,
  user_id BINARY(16) NULL,
  user_role VARCHAR(64) NULL,
  event_type VARCHAR(64) NOT NULL,   -- e.g., USER_UPDATE, TENANT_DELETE
  event_version INT NOT NULL DEFAULT 1,
  request_id BINARY(16) NULL,
  trace_id BINARY(16) NULL,
  http_method VARCHAR(16) NULL,
  http_path TEXT NULL,
  ip_address VARCHAR(45) NULL,
  user_agent TEXT NULL,
  
  resource JSON NULL,   -- [{ resourceTable, resourceId, historyId }]
  outcome JSON NULL,   -- { success: true, message: "" }
  metadata JSON NULL,   -- extra metadata
  performance JSON NULL,   -- timings / latency
  audit BOOLEAN NOT NULL DEFAULT TRUE,
  previous_hash CHAR(64) NULL,
  hash CHAR(64) NULL,
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  INDEX idx_tenant_time (tenant_id, timestamp),
  INDEX idx_actor_user (user_id),
  INDEX idx_event_type (event_type)
);

