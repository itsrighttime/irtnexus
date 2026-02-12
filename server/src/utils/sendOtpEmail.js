import { emailService } from "#config";
import { loadFile } from "#utils";

// Load HTML and CSS templates once at module initialization
const htmlContent = await loadFile("./src/utils/mailContent/html/otp.html");
const cssContent = await loadFile(
  "./src/utils/mailContent/css/registration.css",
);

/**
 * Send an OTP email to a user.
 *
 * @param {string} email - Recipient's email address
 * @param {string} name - Recipient's name
 * @param {string} otp - One-time password
 * @param {string|number} [otp_validity=5] - OTP validity in minutes
 *
 * @returns {Promise<boolean>} Resolves true if email is sent successfully
 *
 * @throws {Error} Throws if sending the email fails
 *
 * @example
 * await sendOtpEmail("user@example.com", "John Doe", "123456", 10);
 */
export const sendOtpEmail = async (email, name, otp, otp_validity = "5") => {
  try {
    const variables = {
      user_name: name,
      otp,
      otp_validity,
    };

    await emailService.sendEmail({
      to: email,
      subject: "irt-dev Account Confirmation - Your OTP Code",
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
