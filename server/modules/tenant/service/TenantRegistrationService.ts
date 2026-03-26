import { withTransaction } from "#packages/database";
import { RegisterTenantInput } from "../types/RegisterTenantInput";

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

export class TenantRegistrationService {
  async register(data: RegisterTenantInput, ctx: DB_RequestContext) {
    const username = data.username;
    const email = data.adminEmail;
    const phone = data.adminPhone;
    const identifier = data.identifier;
    const organizationName = data.organizationName;

    return withTransaction(async (client) => {
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
          full_name: data.adminName,
          name_type: "primary",
          verified: false,
        },
        ctx,
        client,
      );

      // 6 Assign Role (Owner)
      const ownerRole = await repoRole.findByName("OWNER", ctx, client);

      if (!ownerRole) {
        throw new Error("Owner role not found");
      }

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
  }
}
