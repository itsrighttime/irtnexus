export const STATUS = {
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
  INFO: "INFO",
  REDIRECT: "REDIRECT",
} as const;

export type StatusType = (typeof STATUS)[keyof typeof STATUS]; 
// "SUCCESS" | "ERROR" | "INFO" | "REDIRECT"