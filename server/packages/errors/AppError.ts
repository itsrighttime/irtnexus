type AppErrorOptions = {
  statusCode?: number;
  isOperational?: boolean;
  details?: any;
};

export type AppErrorParams = {
  message: string;
  uniqueCode: string;
  options?: AppErrorOptions;
};

export class AppError extends Error {
  public readonly name: string;
  public readonly isOperational: boolean;
  public readonly statusCode: number;
  public readonly uniqueCode: string;
  public readonly timestamp: string;
  public readonly details?: any;

  constructor(
    message: string,
    uniqueCode: string,
    options?: {
      statusCode?: number;
      isOperational?: boolean;
      details?: any;
    },
  ) {
    super(message);

    this.name = this.constructor.name;
    this.uniqueCode = uniqueCode;
    this.isOperational = options?.isOperational ?? true; // distinguish from programmer errors
    this.statusCode = options?.statusCode ?? 500; // default to server error
    this.timestamp = new Date().toISOString();
    this.details = options?.details;

    // Capture stack trace excluding constructor
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, uniqueCode: string, details?: any) {
    super(message, uniqueCode, {
      statusCode: 400,
      details,
    });
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, uniqueCode: string) {
    super(`${resource} not found`, uniqueCode, {
      statusCode: 404,
    });
  }
}

export class AuthError extends AppError {
  constructor(message = "Unauthorized access", uniqueCode: string) {
    super(message, uniqueCode, {
      statusCode: 401,
    });
  }
}
