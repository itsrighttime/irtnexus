import { Operator, WhereCondition } from "./types";

function isOperatorCondition(obj: any): obj is { op: Operator; value: any } {
  return obj && typeof obj === "object" && "op" in obj && "value" in obj;
}

export function buildWhereClause<T>(
  where: WhereCondition<T>,
  values: any[],
  validateColumns: (cols: string[]) => void,
): string {
  const clauses: string[] = [];

  Object.entries(where).forEach(([key, condition]) => {
    validateColumns([key]);

    // Simple equality
    if (!isOperatorCondition(condition)) {
      values.push(condition);
      clauses.push(`${key} = $${values.length}`);
      return;
    }

    // Now TypeScript knows condition has { op, value }
    const { op, value } = condition;

    switch (op) {
      case "IN":
        if (!Array.isArray(value) || value.length === 0) {
          throw new Error(`IN operator requires non-empty array`);
        }
        const placeholders = value.map((_, i) => `$${values.length + i + 1}`);
        values.push(...value);
        clauses.push(`${key} IN (${placeholders.join(", ")})`);
        break;

      case "LIKE":
      case "ILIKE":
        values.push(value);
        clauses.push(`${key} ${op} $${values.length}`);
        break;

      case "BETWEEN":
        if (!Array.isArray(value) || value.length !== 2) {
          throw new Error("BETWEEN requires [min, max]");
        }
        values.push(value[0], value[1]);
        clauses.push(
          `${key} BETWEEN $${values.length - 1} AND $${values.length}`,
        );
        break;

      default:
        values.push(value);
        clauses.push(`${key} ${op} $${values.length}`);
    }
  });

  return clauses.length ? clauses.join(" AND ") : "";
}
