import { Account } from "#modules/identity/index.js";
import { Tenant } from "./Tenant.type";

export type RegisterTenantInput = {
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  adminUsername: string;
  organizationName: string;
  identifier: string;
};

export type RegisterTenantResponse = {
  tenant: Tenant;
  account: Account;
};
