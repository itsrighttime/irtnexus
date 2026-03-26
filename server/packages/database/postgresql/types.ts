import { QueryResultRow } from "pg";

export type CRUDOperation = "CREATE" | "UPDATE" | "DELETE";

export interface VersionEntry<T extends QueryResultRow> {
  recordId: number;
  data: Partial<T>;
  operation: CRUDOperation;
  performedBy: string;
  performedAt?: Date;
}

export interface BaseRepositoryOptions {
  tableName: string;
  versionTableName: string;
  primaryKey: string;
  asyncVersioning?: boolean;
  asyncWrites?: boolean;
}

export interface DB_RequestContext {
  userId: string;
  tenantId?: string;
}

export type ColumnOptions<T> = {
  include?: (keyof T)[];
  exclude?: (keyof T)[];
};
