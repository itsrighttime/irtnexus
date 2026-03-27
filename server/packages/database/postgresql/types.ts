import { QueryResultRow } from "pg";

export type CRUDOperation = "CREATE" | "UPDATE" | "DELETE";

export interface VersionEntry<T extends QueryResultRow> {
  recordId: number;
  data: Partial<T>;
  operation: CRUDOperation;
  performedBy: string | null;
  performedAt?: Date;
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
  userId: string | null;
  tenantId?: string;
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
