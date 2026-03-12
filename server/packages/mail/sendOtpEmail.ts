import { emailConfig } from "#configs";
import { UtilsMail } from "#libs";
import { loadFile } from "#utils";

// Load HTML and CSS templates once at module initialization
const htmlContent: string = await loadFile("./src/utils/mail/html/otp.html");
const cssContent: string = await loadFile(
  "./src/utils/mail/css/registration.css",
);

const { EmailService } = UtilsMail;

const emailService = new EmailService(emailConfig);



/**
 * Send an OTP email to a user.
 *
 * @param email - Recipient's email address
 * @param name - Recipient's name
 * @param otp - One-time password
 * @param otp_validity - OTP validity in minutes (default: 5)
 *
 * @returns Resolves true if email is sent successfully
 *
 * @throws Throws if sending the email fails
 *
 * @example
 * await sendOtpEmail("user@example.com", "John Doe", "123456", 10);
 */
export const sendOtpEmail = async (
  email: string,
  name: string,
  otp: string,
  otp_validity: string | number = "5",
): Promise<boolean> => {
  try {
    const variables = {
      user_name: name,
      otp,
      otp_validity,
    };

    await emailService.sendEmail({
      to: email,
      subject: "iRtNexus Account Confirmation - Your OTP Code",
      html: htmlContent,
      css: cssContent,
      variables,
    });

    return true;
  } catch (err) {
    console.error("Error sending OTP email:", err);
    throw new Error("Failed to send OTP email");
  }
};
