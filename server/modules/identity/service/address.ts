import {
  withTransaction,
  DB_RequestContext,
  DB_GLOBAL_CONST,
} from "#packages/database";
import { PoolClient } from "pg";
import { repoAccountAddress } from "../repository";
import { ADDRESS_TYPE, AddressType } from "../const";
import { AppError } from "#packages/errors/AppError.js";

export const AddressService = {
  /** ---------------- ADD ADDRESS ---------------- */
  async addAddress(
    params: {
      accountId: string;
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
      }>;
    },
    ctx: DB_RequestContext,
    client?: PoolClient,
  ) {
    const { accountId, address } = params;

    return repoAccountAddress.create(
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
  },

  /** ---------------- UPDATE ADDRESS ---------------- */
  async updateAddress(
    params: {
      addressId: string;
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
      }>;
    },
    ctx: DB_RequestContext,
    client?: PoolClient,
  ) {
    const { addressId, updates } = params;

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
    params: { addressId: string },
    ctx: DB_RequestContext,
    client?: PoolClient,
  ) {
    const { addressId } = params;
    await repoAccountAddress.delete(addressId, ctx, client);
  },

  /** ---------------- LIST ADDRESSES ---------------- */
  async listAddresses(
    params: { accountId: string },
    ctx: DB_RequestContext,
    client?: PoolClient,
  ) {
    const { accountId } = params;

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
  async getAddress(
    params: { addressId: string },
    ctx: DB_RequestContext,
    client?: PoolClient,
  ) {
    const { addressId } = params;
    return repoAccountAddress.findById(addressId, client);
  },

  /** ---------------- SET PRIMARY ADDRESS ---------------- */
  async setPrimaryAddress(
    params: { accountId: string; addressId: string },
    ctx: DB_RequestContext,
    client?: PoolClient,
  ) {
    const { accountId, addressId } = params;

    return withTransaction(async (tx) => {
      const address = await repoAccountAddress.findOne(
        { address_id: addressId, account_id: accountId },
        ctx,
        tx,
      );

      if (!address) {
        throw new AppError(
          "Address not found for this account",
          "ADDRESS_NOT_FOUND",
          {
            statusCode: 404,
          },
        );
      }

      if (address.address_type === ADDRESS_TYPE.PRIMARY) {
        return address;
      }

      await repoAccountAddress.updateWhere(
        { account_id: accountId, address_type: ADDRESS_TYPE.PRIMARY },
        { address_type: ADDRESS_TYPE.HOME },
        ctx,
        tx,
      );

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
