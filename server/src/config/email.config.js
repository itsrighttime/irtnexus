import { UtilsMail } from "#packages";
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

const { EmailService } = UtilsMail;

/**
 * Email Service Instance
 *
 * Configures the email service with SMTP credentials.
 * Used for sending transactional emails (OTP, notifications, alerts, etc.).
 *
 * Configuration:
 * - user: SMTP username (from environment variable)
 * - pass: SMTP password (from environment variable)
 */
export const emailService = new EmailService({
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS,
});
