export type UUID = string;
export type JSONB = Record<string, any>;

export type NotificationType =
  | "OTP"
  | "ORDER_CONFIRMATION"
  | "PASSWORD_RESET"
  | "WELCOME";

export type NotificationCategory =
  | "TRANSACTIONAL"
  | "SECURITY"
  | "MARKETING"
  | "SYSTEM";

export type NotificationPriority = "LOW" | "NORMAL" | "HIGH";

export type NotificationChannel = "EMAIL" | "SMS" | "PUSH" | "IN_APP";

export type NotificationStatus = "PENDING" | "SENT" | "FAILED" | "RETRYING";

export type JobStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

export type DeliveryStatus = "SUCCESS" | "FAILED";
