import dotenv from "dotenv";
dotenv.config();

export const emailConfig = {
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS,
};
