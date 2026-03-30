import { QueryResultRow } from "pg";

export type CRUDOperation = "CREATE" | "UPDATE" | "DELETE";

export interface VersionEntry<T extends QueryResultRow> {
  recordId: string; // UUID now, not number
  tenantId: string; // REQUIRED
  data: Partial<T>; // snapshot
  operation: CRUDOperation; // optional but useful
  performedBy: string | null; // maps to changed_by
  performedAt?: Date; // maps to created_at
  changeReason?: string | null; // NEW
}

export interface BaseRepositoryOptions {
  tableName: string;
  versionTableName: string;
  primaryKey: string;
  allowedColumns: string[];
  asyncVersioning?: boolean;
  asyncWrites?: boolean;
}

export interface DB_RequestContext {
  accountId: string;
  tenantId: string;
}

export type ColumnOptions<T> = {
  include?: (keyof T)[];
  exclude?: (keyof T)[];
};

export type Operator =
  | "="
  | "!="
  | ">"
  | "<"
  | ">="
  | "<="
  | "IN"
  | "LIKE"
  | "ILIKE"
  | "BETWEEN";

export type WhereCondition<T> = {
  [K in keyof T]?:
    | T[K]
    | {
        op: Operator;
        value: any;
      };
};

export type QueryOptions<T> = {
  where?: WhereCondition<T>;

  orderBy?: {
    column: keyof T;
    direction?: "ASC" | "DESC";
  }[];

  limit?: number;
  offset?: number;

  includeDeleted?: boolean;
};
