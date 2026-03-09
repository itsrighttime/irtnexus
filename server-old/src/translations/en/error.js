export default {
  error: {
    default: "Something went wrong",
    not_found: "Resource not found",
    unauthorized: "Unauthorized access",
    forbidden: "Forbidden",
    bad_request: "Bad request",
    conflict: "Conflict occurred",
    server_error: "Internal server error",
    validation: {
      required: "This field is required",
      invalid: "Invalid value",
      email: "Invalid email address",
      password_length: "Password must be at least 8 characters",
      min_length: (min) => `Field must be at least ${min} characters`,
      max_length: (max) => `Field cannot exceed ${max} characters`,
    },
  },
};
