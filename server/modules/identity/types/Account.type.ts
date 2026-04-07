import { AccountIdentityLevel, AccountStatus } from "../const";

export interface Account {
  account_id: string;

  username: string;

  status: AccountStatus;
  identity_level: AccountIdentityLevel;

  preferred_language?: string | null;
  preferred_timezone?: string | null;

  deleted_at?: Date | null;

  created_at: Date;
  updated_at: Date;
}

export type CreateAccountInput = Omit<
  Account,
  "account_id" | "created_at" | "updated_at" | "deleted_at"
> & {
  name: string;
  email: string;
  password: string;
  rePassword: string;
};
