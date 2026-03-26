export interface RolePermission {
  role_permission_id: string;

  role_id: string;
  permission_id: string;

  deleted_at?: Date | null;

  created_at: Date;
  updated_at: Date;
}
