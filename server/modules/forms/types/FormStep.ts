export interface FormStep {
  form_steps_id: string;
  form_id: string;
  tenant_id: string;
  status?: string;
  title?: string;
  description?: string;
  step_order?: string;
  fields?: JSON;
  deleted_at?: Date | null;
  created_at: Date;
  updated_at: Date;
}
