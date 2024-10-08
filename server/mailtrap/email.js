import {
  RESET_PASSWORD_EMAIL_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
} from "./emailTemplates.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify your Email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "verificationCode",
        verificationToken
      ),
      category: "Verification",
    });
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error(`Error sending verification email to ${email}:`, error);
  }
};
export const sendWelcomeEmail = async (email) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Welcome to our website",
      html: WELCOME_EMAIL_TEMPLATE,
      category: "Welcome",
    });
  } catch (error) {
    console.error(`Error sending welcome email to ${email}:`, error);
    throw error;
  }
};
export const sendPasswordResetEmail = async (email, token) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Reset your password",
      html: RESET_PASSWORD_EMAIL_TEMPLATE.replace("{resetURL}", token),
      category: "Reset Password",
    });
    console.log(`Password reset email sent to ${email}`);
  } catch (error) {
    console.error(`Error sending password reset email to ${email}:`, error);
  }
};
export const sendSuccessMail = async (email) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Success",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Success",
    });
    console.log(`Success email sent to ${email}`);
  } catch (error) {
    console.error(`Error sending success email to ${email}:`, error);
  }
};
