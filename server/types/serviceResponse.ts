export type ServiceResponse<T> =
  | {
      success: true;
      data: T;
      message?: string;
    }
  | {
      success: false;
      errors?: Record<string, string>;
      message?: string;
    };
