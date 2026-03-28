export const registerTenantSchema = {
  description: "Register a new tenant in the system",
  tags: ["Tenant Management"],
  body: {
    type: "object",
    required: [
      "adminName",
      "adminEmail",
      "adminPhone",
      "adminUsername",
      "organizationName",
      "identifier",
    ],
    properties: {
      adminName: { type: "string", minLength: 2 },
      adminEmail: { type: "string", format: "email" },
      adminPhone: { type: "string", minLength: 10 },
      adminUsername: { type: "string", minLength: 5, pattern: "^[a-z0-9-]+$" },
      organizationName: { type: "string", minLength: 3 },
      identifier: { type: "string", pattern: "^[a-z0-9-]+$", minLength: 5 },
    },
  },

  response: {
    200: {
      type: "object",
      properties: {
        status: {
          type: "string",
          enum: ["SUCCESS", "ERROR", "INFO", "REDIRECT"],
        },
        code: { type: "number" },
        message: { type: "string" },
        uniqueCode: { type: "string" },
        data: {
          type: "object",
          nullable: true,
          properties: {
            tenant: { type: "object", additionalProperties: true },
            account: { type: "object", additionalProperties: true },
          },
        },
        meta: { type: "object", additionalProperties: true },
      },
      required: ["status", "code", "message", "uniqueCode", "meta"],
    },

    400: {
      type: "object",
      properties: {
        status: { type: "string", enum: ["ERROR"] },
        code: { type: "number" },
        message: { type: "string" },
        uniqueCode: { type: "string" },
        errors: {
          type: "object",
          additionalProperties: { type: "string" },
        },
        meta: { type: "object", additionalProperties: true },
      },
      required: ["status", "code", "message", "uniqueCode", "errors", "meta"],
    },
  },
} as const;
