export interface FormSubmission {
  form_submissions_id: string;
  form_id: string;
  form_name: string;
  submitter_email: string;
  submitter_phone: string;
  external_user_id: string;
  data: Record<string, any>;
  deleted_at?: Date | null;
  created_at: Date;
  updated_at: Date;
}
