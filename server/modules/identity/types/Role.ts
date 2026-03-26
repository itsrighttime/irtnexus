export interface Role {
  role_id: string;

  name: string;
  description?: string | null;

  deleted_at?: Date | null;

  created_at: Date;
  updated_at: Date;
}
