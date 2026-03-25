CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NULL REFERENCES tenants(tenant_id),
    account_id UUID NULL REFERENCES accounts(account_id),
    user_role VARCHAR(64) NULL,
    event_type VARCHAR(64) NOT NULL,   -- e.g., USER_UPDATE, TENANT_DELETE
    event_version INT NOT NULL DEFAULT 1,
    request_id UUID NULL,
    trace_id UUID NULL,
    http_method VARCHAR(16) NULL,
    http_path TEXT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    
    resource JSONB NULL,   -- [{ resourceTable, resourceId, historyId }]
    outcome JSONB NULL,    -- { success: true, message: "" }
    metadata JSONB NULL,   -- extra metadata
    performance JSONB NULL,-- timings / latency
    audit BOOLEAN NOT NULL DEFAULT TRUE,
    previous_hash CHAR(64) NULL,
    hash CHAR(64) NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_audit_tenant_time ON audit_logs (tenant_id, timestamp);
CREATE INDEX idx_audit_user ON audit_logs (account_id);
CREATE INDEX idx_audit_event_type ON audit_logs (event_type);
