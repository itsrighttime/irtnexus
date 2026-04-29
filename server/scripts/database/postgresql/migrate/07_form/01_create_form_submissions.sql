CREATE TABLE form_submissions (
    form_submissions_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    form_id UUID REFERENCES forms(form_id) ON DELETE CASCADE,
    data JSONB,

    deleted_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


--
--
CREATE TABLE form_submissions_versions (
    version_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    form_submissions_id UUID NOT NULL REFERENCES form_submissions(form_submissions_id),
    version_number INT NOT NULL,
    data_snapshot JSONB NOT NULL,
    changed_by UUID NULL REFERENCES accounts(account_id),
    change_reason TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);