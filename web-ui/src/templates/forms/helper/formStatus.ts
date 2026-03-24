export const FORM_STATUS = {
  fill: "filling",
  error: "error",
  submitted: "submitted",
  submitting: "submitting",
  failed: "failed",
} as const;

export type FormStatus = (typeof FORM_STATUS)[keyof typeof FORM_STATUS];
