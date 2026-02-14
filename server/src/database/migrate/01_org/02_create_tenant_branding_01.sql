CREATE TABLE IF NOT EXISTS tenant_branding (
    branding_id BINARY(16) PRIMARY KEY,
    tenant_id BINARY(16) NOT NULL,

    -- Logos
    logo_url VARCHAR(500) NULL,
    favicon_url VARCHAR(500) NULL,

    -- Colors
    primary_color VARCHAR(20) NULL,
    secondary_color VARCHAR(20) NULL,
    accent_color VARCHAR(20) NULL,

    -- Typography
    font_family VARCHAR(100) NULL,

    -- Custom CSS / JS overrides
    custom_css TEXT NULL,
    custom_js TEXT NULL,

    -- Email templates override
    email_header_html TEXT NULL,
    email_footer_html TEXT NULL,

    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY uq_tenant_branding (tenant_id),
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id) ON DELETE CASCADE
);
