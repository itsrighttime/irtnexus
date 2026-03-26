export interface Tenant {
  tenant_id: string;

  name: string;
  identifier: string;

  plan: string;
  status: string;

  logo_url?: string | null;
  favicon_url?: string | null;

  primary_color?: string | null;
  secondary_color?: string | null;
  background_color?: string | null;

  background_image_url?: string | null;

  font_family?: string | null;
  font_size_base?: string | null;
  font_weight_base?: string | null;

  border_radius?: string | null;
  border_color?: string | null;

  shadow_style?: string | null;
  spacing_base?: string | null;

  theme_mode?: string | null;
  custom_css?: string | null;

  deleted_at?: Date | null;

  created_at: Date;
  updated_at: Date;
}
