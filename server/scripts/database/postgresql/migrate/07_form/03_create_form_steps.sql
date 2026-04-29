CREATE TABLE form_steps (
  form_steps_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  form_id UUID REFERENCES forms(form_id) ON DELETE CASCADE,
  title TEXT,
  description TEXT,
  step_order INT,
  fields JSONB, -- array of fields for this step
  deleted_at TIMESTAMPTZ DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

--
--
CREATE TABLE form_steps_versions (
    version_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    form_steps_id UUID NOT NULL REFERENCES form_steps(form_steps_id),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id),
    version_number INT NOT NULL,
    data_snapshot JSONB NOT NULL,
    changed_by UUID NULL REFERENCES accounts(account_id),
    change_reason TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);