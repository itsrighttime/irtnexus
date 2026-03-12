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
  asyncVersioning?: boolean;
  asyncWrites?: boolean;
}

export interface RequestContext {
  userId: string;
  tenantId?: string;
}
