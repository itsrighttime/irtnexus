CREATE TABLE notification_jobs (
    job_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    notification_id UUID REFERENCES notifications(notification_id),

    status TEXT DEFAULT 'PENDING', -- PENDING, PROCESSING, COMPLETED, FAILED

    scheduled_at TIMESTAMPTZ,
    processed_at TIMESTAMPTZ,

    attempts INT DEFAULT 0,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ DEFAULT NULL
);
--
CREATE TABLE notification_jobs_versions (
    version_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES notification_jobs(job_id),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id),
    version_number INT NOT NULL,
    data_snapshot JSONB NOT NULL,
    changed_by UUID NULL REFERENCES accounts(account_id),
    change_reason TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);