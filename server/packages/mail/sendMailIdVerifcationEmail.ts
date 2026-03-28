import { emailConfig } from "#configs";
import { UtilsMail } from "#libs";
import { loadFile } from "#utils";

// Load HTML and CSS templates once at module initialization
const htmlContent: string = await loadFile("./packages/mail/html/verificationMail.html");
const cssContent: string = await loadFile(
  "./packages/mail/css/registration.css",
);

const { EmailService } = UtilsMail;

const emailService = new EmailService(emailConfig);

/**
 * Send an OTP email to a user.
 *
 * @param email - Recipient's email address
 * @param name - Recipient's name
 * @param verificationLink - One-time password
 * @param validity - OTP validity in minutes (default: 5)
 *
 * @returns Resolves true if email is sent successfully
 *
 * @throws Throws if sending the email fails
 *
 * @example
 * await sendOtpEmail("user@example.com", "John Doe", "123456", 10);
 */
export const sendMailIdVerifcationEmail = async (
  email: string,
  name: string,
  verificationLink: string,
  validity: string | number = "5",
): Promise<boolean> => {
  try {
    const variables = {
      user_name: name,
      otp: verificationLink,
      otp_validity: validity,
    };

    await emailService.sendEmail({
      to: email,
      subject: "iRtNexus Account Mail ID Confirmation - Verify with link",
      html: htmlContent,
      css: cssContent,
      variables,
    });

    return true;
  } catch (err) {
    console.error("Error sending verification email:", err);
    throw new Error("Failed to send verification email");
  }
};
