CREATE TABLE form_submissions (
    form_submissions_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    form_id UUID REFERENCES forms(form_id) ON DELETE CASCADE,
    form_name VARCHAR(50),
    submitter_email VARCHAR(225),
    submitter_phone VARCHAR(50),
    external_user_id UUID,
    data JSONB,
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(form_id, submitter_email),
    UNIQUE(form_id, submitter_phone),
    UNIQUE(form_id, submitter_email, submitter_phone)
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