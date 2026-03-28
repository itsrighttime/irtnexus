// tenant.preValidation.ts

import { RegisterTenantInput } from "#modules/tenant";
import { FastifyRequest } from "fastify";

export async function normalizeRegisterTenant(
  request: FastifyRequest<{ Body: RegisterTenantInput }>,
) {
  const body = request.body;

  // Email
  if (body.adminEmail) {
    body.adminEmail = body.adminEmail.trim().toLowerCase();
  }

  // Username (slug-safe)
  if (body.adminUsername) {
    body.adminUsername = body.adminUsername
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-"); // spaces → hyphen
  }

  // Identifier (slug-safe org id)
  if (body.identifier) {
    body.identifier = body.identifier.trim().toLowerCase().replace(/\s+/g, "-");
  }

  // Name cleanup
  if (body.adminName) {
    body.adminName = body.adminName.trim().replace(/\s+/g, " "); // collapse multiple spaces
  }

  // Organization name cleanup
  if (body.organizationName) {
    body.organizationName = body.organizationName.trim().replace(/\s+/g, " ");
  }

  // Phone normalization (basic)
  if (body.adminPhone) {
    body.adminPhone = body.adminPhone
      .replace(/\s+/g, "") // remove spaces
      .replace(/-/g, "") // remove dashes
      .replace(/^\+/, ""); // remove leading +
  }
}
