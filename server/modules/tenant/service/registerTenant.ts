import { withTransaction } from "#packages/database";
import {
  RegisterTenantInput,
  RegisterTenantResponse,
} from "../types/RegisterTenantInput";

import { DB_RequestContext } from "#packages/database";
import { repoTenant, repoTenantOwner } from "../repository";
import {
  repoAccount,
  repoAccountEmail,
  repoAccountName,
  repoAccountPhone,
  repoRole,
  repoTenantMembership,
} from "#modules/identity/index.js";
import { ServiceResponse } from "#types";

export async function registerTenant(
  data: RegisterTenantInput,
  ctx: DB_RequestContext,
): Promise<ServiceResponse<RegisterTenantResponse>> {
  const username = data.adminUsername;
  const name = data.adminName;
  const email = data.adminEmail;
  const phone = data.adminPhone;
  const identifier = data.identifier;
  const organizationName = data.organizationName;

  const [existingUsername, existingEmail, existingPhone, existingTenant] =
    await Promise.all([
      repoAccount.findOne({ username }, ctx),
      repoAccountEmail.findOne({ email }, ctx),
      repoAccountPhone.findOne({ phone_number: phone }, ctx),
      repoTenant.findOne({ identifier }, ctx),
    ]);

  const errors: Record<string, string> = {};

  if (existingUsername) {
    errors.username = "Username already taken";
  }

  if (existingEmail) {
    errors.email = "Email already in use";
  }

  if (existingPhone) {
    errors.phone = "Phone number already in use";
  }

  if (existingTenant) {
    errors.identifier = "Organization identifier already exists";
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      errors,
      message: "Validation failed",
    };
  }

  try {
    const result = await withTransaction(async (client) => {
      // 1 Create Tenant
      const tenant = await repoTenant.create(
        {
          name: organizationName,
          identifier,
          plan: "free",
          status: "active",
        },
        ctx,
        client,
      );

      // 2 Create Account (Admin)
      const account = await repoAccount.create(
        {
          username,
          status: "pending_verification",
          identity_level: "L0",
        },
        ctx,
        client,
      );

      // 3 Add Email
      await repoAccountEmail.create(
        {
          account_id: account.account_id,
          email,
          is_primary: true,
          verified: false,
        },
        ctx,
        client,
      );

      // 4 Add Phone
      await repoAccountPhone.create(
        {
          account_id: account.account_id,
          phone_number: phone,
          is_primary: true,
          verified: false,
        },
        ctx,
        client,
      );

      // 5 Add Name
      await repoAccountName.create(
        {
          account_id: account.account_id,
          full_name: name,
          name_type: "primary",
          verified: false,
        },
        ctx,
        client,
      );

      // 6 Assign Role (Owner)
      const ownerRole = await repoRole.findOne({ name: "OWNER" }, ctx, client);

      if (!ownerRole) {
        throw new Error("Owner role not found");
      }

      ctx.tenantId = tenant.tenant_id;

      await repoTenantMembership.create(
        {
          tenant_id: tenant.tenant_id,
          account_id: account.account_id,
          role_id: ownerRole.role_id,
          status: "active",
        },
        ctx,
        client,
      );

      // 7 Create tenant owner entry
      await repoTenantOwner.create(
        {
          tenant_id: tenant.tenant_id,
          account_id: account.account_id,
          ownership_percentage: 100,
        },
        ctx,
        client,
      );

      return {
        tenant,
        account,
      };
    });

    return {
      success: true,
      data: result,
    };
  } catch (err: any) {
    // Handle DB unique constraint (race condition case)
    if (err.code === "23505") {
      return {
        success: false,
        message: "Duplicate value detected. Please retry.",
      };
    }

    // Unexpected error → still throw
    throw err;
  }
}
