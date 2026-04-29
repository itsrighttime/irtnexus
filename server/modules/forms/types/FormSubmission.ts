export interface FormSubmission {
  form_submissions_id: string;
  form_id: string;
  data: JSON;
  deleted_at?: Date | null;
  created_at: Date;
  updated_at: Date;
}
