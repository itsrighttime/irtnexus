export const OPERATORS = {
  in: "in",
  notIn: "notIn",
  equals: "equals",
  notEquals: "notEquals",
  gt: "gt",
  lt: "lt",
  gte: "gte",
  lte: "lte",
  contains: "contains",
  notContains: "notContains",
} as const;

// Type for keys
type OperatorKey = keyof typeof OPERATORS;

// Type for values
export type OperatorValue = (typeof OPERATORS)[OperatorKey];
