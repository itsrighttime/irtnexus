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
