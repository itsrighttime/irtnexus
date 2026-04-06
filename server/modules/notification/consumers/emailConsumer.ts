import { loadFile } from "#utils";
import { UtilsMail } from "#libs";
import { emailConfig } from "#configs";
import { BaseEvent, EventBus } from "#packages/event-bus";

// Initialize email service
const { EmailService } = UtilsMail;
const emailService = new EmailService(emailConfig);

// Preload templates
const htmlContent: string = await loadFile(
  "./packages/mail/html/verificationMail.html",
);
const cssContent: string = await loadFile(
  "./packages/mail/css/registration.css",
);

/**
 * Generic helper to send email
 */
const sendNotificationEmail = async (
  to: string,
  subject: string,
  variables: Record<string, any>,
) => {
  await emailService.sendEmail({
    to,
    subject,
    html: htmlContent,
    css: cssContent,
    variables,
  });
};

/**
 * Email Consumer: listens to NOTIFICATION_EMAIL_SEND events
 */
export const emailConsumer = (eventBus: EventBus) => {
  eventBus.subscribe("NOTIFICATION_EMAIL_SEND", async (event: BaseEvent) => {
    try {
      const { notificationId, recipient, content } = event.payload;

      // recipient.accountId could be used to fetch user's email if not in payload
      const toEmail = recipient.email;
      if (!toEmail) throw new Error("Recipient email not found");

      const subject = content.subject || "iRtNexus Notification";
      const variables = content.data || {}; // optional variables for template interpolation

      await sendNotificationEmail(toEmail, subject, variables);

      console.log(
        `Email sent for notification ${notificationId} to ${toEmail}`,
      );
    } catch (err) {
      console.error("Error processing email notification:", err);
    }
  });
};
