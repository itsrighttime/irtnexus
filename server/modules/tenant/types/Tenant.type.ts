export interface Tenant {
  tenant_id: string;

  name: string;
  identifier: string;

  plan: string;
  status: string;

  logo_url?: string;
  favicon_url?: string;

  primary_color?: string;
  secondary_color?: string;
  background_color?: string;

  background_image_url?: string;

  font_family?: string;
  font_size_base?: string;
  font_weight_base?: string;

  border_radius?: string;
  border_color?: string;

  shadow_style?: string;
  spacing_base?: string;

  theme_mode?: string;
  custom_css?: string;

  created_at: Date;
  updated_at: Date;
}
