import dotenv from "dotenv";
dotenv.config();

export const JWT_CONFIG = {
  SECRET: process.env.JWT_SECRET || "your-default-secret",
  EXPIRES: process.env.JWT_EXPIRES || "1h",
} as const;
