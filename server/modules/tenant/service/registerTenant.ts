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
  repoVerification,
} from "#modules/identity";
import { ServiceResponse } from "#types";
import { sendMailIdVerifcationEmail } from "#packages/mail";
import { repoPassword } from "#modules/auth";
import { generateUUID, HASH_SALT, hashText } from "#packages/utils";
import { GENERAl_CONST } from "#configs";

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
  const password = data.password;
  const rePassword = data.rePassword;

  const [existingUsername, existingEmail, existingPhone, existingTenant] =
    await Promise.all([
      repoAccount.findOne({ username }, ctx),
      repoAccountEmail.findOne({ email }, ctx),
      repoAccountPhone.findOne({ phone_number: phone }, ctx),
      repoTenant.findOne({ identifier }, ctx),
    ]);

  const errors: Record<string, string> = {};

  if (password !== rePassword)
    errors.password = "Password and Re-Password must be same";

  if (existingUsername) errors.username = "Username already taken";

  if (existingEmail) errors.email = "Email already in use";

  if (existingPhone) errors.phone = "Phone number already in use";

  if (existingTenant)
    errors.identifier = "Organization identifier already exists";

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

      const hashPasswordKey = await hashText(password);

      // 8 Create tenant owner entry
      await repoPassword.create(
        {
          tenant_id: tenant.tenant_id,
          account_id: account.account_id,
          password_hash: hashPasswordKey,
          salt: String(HASH_SALT),
        },
        ctx,
        client,
      );

      // Sending Mail for Email verification
      const verificationToken = generateUUID();
      const verificationLink = `${GENERAl_CONST.FRONTEND_URL}/verify-email?token=${verificationToken}`;
      const expireMinutes = 0.5 * 60;

      const expiresAt = new Date(Date.now() + expireMinutes * 60 * 1000);

      await repoVerification.create(
        {
          tenant_id: tenant.tenant_id,
          account_id: account.account_id,
          target_id: email,
          type: "EMAIL",
          token: verificationToken,
          expires_at: expiresAt,
        },
        ctx,
        client,
      );

      const isMailSend = await sendMailIdVerifcationEmail(
        email,
        name,
        verificationLink,
        expireMinutes,
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
