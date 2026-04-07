import { FastifySchema } from "fastify";
// import { ACCOUNT_IDENTITY_LEVEL, ACCOUNT_STATUS } from "../const";

export const createAccountSchema: FastifySchema = {
  description: "Register a new Account in the system",
  tags: ["Account Management"],
  body: {
    type: "object",
    required: ["username", "name", "email", "password", "rePassword"],
    properties: {
      username: { type: "string", minLength: 3, maxLength: 50 },
      name: { type: "string", minLength: 2, maxLength: 100 },
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 6, maxLength: 100 },
      rePassword: { type: "string", minLength: 6, maxLength: 100 },
    //   status: {
    //     type: "string",
    //     enum: Object.values(ACCOUNT_STATUS),
    //     default: ACCOUNT_STATUS.ACTIVE,
    //   },
    //   identity_level: {
    //     type: "string",
    //     enum: Object.values(ACCOUNT_IDENTITY_LEVEL),
    //     default: ACCOUNT_IDENTITY_LEVEL.UNVERIFIED,
    //   },
      preferred_language: { type: "string", nullable: true },
      preferred_timezone: { type: "string", nullable: true },
    },
    additionalProperties: false,
  },
  response: {
    201: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        data: {
          type: "object",
          properties: {
            account_id: { type: "string" },
            username: { type: "string" },
            status: { type: "string" },
            identity_level: { type: "string" },
            preferred_language: { type: "string", nullable: true },
            preferred_timezone: { type: "string", nullable: true },
            deleted_at: { type: "string", format: "date-time", nullable: true },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
          },
        },
      },
    },
    400: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        message: { type: "string" },
      },
    },
  },
};
