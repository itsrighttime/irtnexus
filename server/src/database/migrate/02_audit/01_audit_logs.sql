CREATE TABLE audit_logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,

  event_id CHAR(36) NOT NULL,
  event_type VARCHAR(64) NOT NULL,
  event_version INT NOT NULL,
  timestamp TIMESTAMP(3) NOT NULL,

  -- Actor
  actor_user_id VARCHAR(64),
  actor_role VARCHAR(64),
  actor_anonymous BOOLEAN,

  -- Request context
  request_id VARCHAR(64),
  trace_id VARCHAR(128),
  http_method VARCHAR(16),
  http_path TEXT,
  ip_address VARCHAR(45),
  user_agent TEXT,

  -- Action / Resource
  action JSON,
  resource JSON,

  -- Extra context
  metadata JSON,
  performance JSON,
  outcome JSON,
  context JSON,

  -- Audit integrity
  audit BOOLEAN NOT NULL,
  previous_hash CHAR(64),
  hash CHAR(64),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_event_type (event_type),
  INDEX idx_actor_user (actor_user_id),
  INDEX idx_timestamp (timestamp)
);
