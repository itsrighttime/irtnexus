import { AddressType } from "../const";

export interface AccountAddress {
  address_id: string;

  tenant_id: string;
  account_id: string;

  address_type?: AddressType;

  house_no?: string | null;
  street_no?: string | null;
  block_no?: string | null;

  city?: string | null;
  district?: string | null;
  state?: string | null;
  country?: string | null;
  pincode?: string | null;

  verified_at?: Date | null;

  valid_from: Date;
  valid_to?: Date | null;

  deleted_at?: Date | null;

  created_at: Date;
  updated_at: Date;
}
