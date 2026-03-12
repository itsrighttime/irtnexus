export interface HandleErrorOptions {
  code?: string;
  context?: Record<string, any> | null;
  isTrusted?: boolean;
  foldeName?: string;
}

export type ErrorLike = Error & { message?: string };

export interface AppError extends Error {
  statusCode?: number;
  details?: any;
  options?: Record<string, any>;
}
