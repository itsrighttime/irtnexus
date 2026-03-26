export interface EmailBranding {
  email_branding_id: string;

  tenant_id: string;

  sender_name?: string | null;
  sender_email?: string | null;

  header_logo_url?: string | null;
  footer_logo_url?: string | null;

  footer_text?: string | null;

  primary_color?: string | null;
  secondary_color?: string | null;

  font_family?: string | null;

  template_overrides?: Record<string, any> | null;

  deleted_at?: Date | null;

  created_at: Date;
  updated_at: Date;
}
