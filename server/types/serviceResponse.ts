export type ServiceResponse<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      errors?: Record<string, string>;
      message?: string;
    };
