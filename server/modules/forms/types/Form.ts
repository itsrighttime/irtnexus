export interface Form {
  form_id: string;
  membership_id: string;
  tenant_id: string;
  status?: string;
  title?: string;
  description?: string;
  mode?: string;
  endpoint?: string;
  settings?: JSON;
  deleted_at?: Date | null;
  created_at: Date;
  updated_at: Date;
}
