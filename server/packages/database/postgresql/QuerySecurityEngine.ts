import { RequestContext } from "./types";

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
  private static detectAliases(sql: string): string[] {
    const aliases: string[] = [];
    let match;

    while ((match = this.tableAliasRegex.exec(sql)) !== null) {
      const alias = match[2] || match[4];

      if (alias) {
        aliases.push(alias.replace(/"/g, ""));
      }
    }

    return [...new Set(aliases)];
  }

  /**
   * Build tenant + soft delete filters
   */
  private static buildFilters(aliases: string[], paramIndex: number): string[] {
    const filters: string[] = [];

    for (const alias of aliases) {
      filters.push(`${alias}.tenant_id = $${paramIndex}`);
      filters.push(`${alias}.deleted_at IS NULL`);
    }

    return filters;
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
  static rewrite(sql: string, ctx: RequestContext, params: any[]) {
    this.ensureReadOnly(sql);

    const aliases = this.detectAliases(sql);

    const filters = this.buildFilters(aliases, params.length + 1);

    const finalSql = this.injectFilters(sql, filters);

    params.push(ctx.tenantId);

    return finalSql;
  }
}
