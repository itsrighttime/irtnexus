import { logger } from "#utils";
import { haveTenantId } from "scripts/database";
import { DB_RequestContext } from "./types";

export class QuerySecurityEngine {
  private static mutationRegex =
    /\b(INSERT|UPDATE|DELETE|ALTER|DROP|TRUNCATE|CREATE)\b/i;

  private static tableAliasRegex =
    /\bFROM\s+([a-zA-Z0-9_".]+)\s+(?:AS\s+)?([a-zA-Z0-9_"]+)|\bJOIN\s+([a-zA-Z0-9_".]+)\s+(?:AS\s+)?([a-zA-Z0-9_"]+)/gi;

  /**
   * Validate read-only query
   */
  private static ensureReadOnly(sql: string) {
    if (this.mutationRegex.test(sql)) {
      throw new Error(
        "Mutation queries are not allowed. Use repository methods.",
      );
    }
  }

  /**
   * Detect table aliases
   */
  private static detectAliases(sql: string): Record<string, string> {
    const aliasMap: Record<string, string> = {};
    let match;

    while ((match = this.tableAliasRegex.exec(sql)) !== null) {
      const table = match[1] || match[3];
      const alias = match[2] || match[4];

      if (table) {
        const cleanTable = table.replace(/"/g, "").split(".").pop()!;
        const cleanAlias = (alias || cleanTable).replace(/"/g, "");

        aliasMap[cleanAlias] = cleanTable;
      }
    }

    return aliasMap;
  }

  /**
   * Build tenant + soft delete filters
   */
  private static buildFilters(
    aliasMap: Record<string, string>,
    paramIndex: number,
  ): { filters: string[]; isTenantIdNeeded: boolean } {
    const filters: string[] = [];
    let isTenantIdNeeded = false;

    for (const [alias, table] of Object.entries(aliasMap)) {
      // Apply tenant filter only if table supports it
      if (haveTenantId(table)) {
        filters.push(`${alias}.tenant_id = $${paramIndex}`);
        isTenantIdNeeded = true;
      }

      // Apply soft delete only if table supports it
      filters.push(`${alias}.deleted_at IS NULL`);
    }

    return { filters, isTenantIdNeeded };
  }

  /**
   * Inject filters into SQL
   */
  private static injectFilters(sql: string, filters: string[]): string {
    if (filters.length === 0) return sql;

    const upper = sql.toUpperCase();

    if (upper.includes("WHERE")) {
      return `${sql} AND ${filters.join(" AND ")}`;
    }

    return `${sql} WHERE ${filters.join(" AND ")}`;
  }

  /**
   * Rewrite SQL query safely
   */
  static rewrite(sql: string, ctx: DB_RequestContext, params: any[]) {
    this.ensureReadOnly(sql);

    const aliases = this.detectAliases(sql);

    const { filters, isTenantIdNeeded } = this.buildFilters(
      aliases,
      params.length + 1,
    );

    const finalSql = this.injectFilters(sql, filters);

    if (isTenantIdNeeded) params.push(ctx.tenantId);

    logger.silly(
      `Query rewritten`,
      {
        originalSql: sql,
        rewrittenSql: finalSql,
        tenantId: ctx.tenantId,
      },
      "DB_QUERY_REWRITE",
    );

    return finalSql;
  }
}
