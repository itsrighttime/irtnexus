export interface PortalBranding {
  portal_branding_id: string;

  tenant_id: string;

  login_background_url?: string | null;
  login_message?: string | null;

  login_button_style?: Record<string, any> | null;

  custom_css?: string | null;

  favicon_url?: string | null;

  deleted_at?: Date | null;

  created_at: Date;
  updated_at: Date;
}
