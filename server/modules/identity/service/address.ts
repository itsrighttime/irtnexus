import {
  withTransaction,
  DB_RequestContext,
  DB_GLOBAL_CONST,
} from "#packages/database";
import { PoolClient } from "pg";
import { repoAccountAddress } from "../repository";
import { ADDRESS_TYPE, AddressType } from "../const";

export const AddressService = {
  /** ---------------- ADD ADDRESS ---------------- */
  async addAddress(
    accountId: string,
    address: Partial<{
      address_type: AddressType;
      house_no: string;
      street_no: string;
      block_no: string;
      city: string;
      district: string;
      state: string;
      country: string;
      pincode: string;
    }>,
    ctx: DB_RequestContext,
    client?: PoolClient,
  ) {
    const created = await repoAccountAddress.create(
      {
        account_id: accountId,
        address_type: address.address_type || ADDRESS_TYPE.HOME,
        house_no: address.house_no,
        street_no: address.street_no,
        block_no: address.block_no,
        city: address.city,
        district: address.district,
        state: address.state,
        country: address.country,
        pincode: address.pincode,
      },
      ctx,
      client,
    );

    return created;
  },

  /** ---------------- UPDATE ADDRESS ---------------- */
  async updateAddress(
    addressId: string,
    updates: Partial<{
      address_type: AddressType;
      house_no: string;
      street_no: string;
      block_no: string;
      city: string;
      district: string;
      state: string;
      country: string;
      pincode: string;
    }>,
    ctx: DB_RequestContext,
    client?: PoolClient,
  ) {
    const [updated] = await repoAccountAddress.updateWhere(
      { address_id: addressId },
      updates,
      ctx,
      client,
    );

    return updated;
  },

  /** ---------------- DELETE ADDRESS ---------------- */
  async deleteAddress(
    addressId: string,
    ctx: DB_RequestContext,
    client?: PoolClient,
  ) {
    await repoAccountAddress.delete(addressId, ctx, client);
  },

  /** ---------------- LIST ADDRESSES ---------------- */
  async listAddresses(
    accountId: string,
    ctx: DB_RequestContext,
    client?: PoolClient,
  ) {
    return repoAccountAddress.select(
      {
        where: { account_id: accountId },
        orderBy: [
          {
            column: DB_GLOBAL_CONST.CREATED_AT,
            direction: DB_GLOBAL_CONST.DESC,
          },
        ],
      },
      ctx,
      client,
    );
  },
  /** ---------------- GET ADDRESS BY ID ---------------- */
  async getAddress(addressId: string, client?: PoolClient) {
    return repoAccountAddress.findById(addressId, client);
  },

  /** ---------------- SET PRIMARY ADDRESS ---------------- */
  async setPrimaryAddress(
    accountId: string,
    addressId: string,
    ctx: DB_RequestContext,
    client?: PoolClient,
  ) {
    return withTransaction(async (tx) => {
      // 1. Validate ownership
      const address = await repoAccountAddress.findOne(
        { address_id: addressId, account_id: accountId },
        ctx,
        tx,
      );
      if (!address) throw new Error("Address not found for this account");

      // Optional: check if already primary
      if (address.address_type === ADDRESS_TYPE.PRIMARY) return address;

      // 2. Demote existing primary
      await repoAccountAddress.updateWhere(
        { account_id: accountId, address_type: ADDRESS_TYPE.PRIMARY },
        { address_type: ADDRESS_TYPE.HOME },
        ctx,
        tx,
      );

      // 3. Promote selected address
      const [updated] = await repoAccountAddress.updateWhere(
        { address_id: addressId, account_id: accountId },
        { address_type: ADDRESS_TYPE.PRIMARY },
        ctx,
        tx,
      );

      return updated;
    }, client);
  },
};
