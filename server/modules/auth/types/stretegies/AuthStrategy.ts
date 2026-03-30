import { DB_RequestContext } from "#packages/database/index.js";
import { ServiceResponse } from "#types";
import { PoolClient } from "pg";

export interface AuthStrategy {
  setup(
    ctx: DB_RequestContext,
    payload: any,
    client?: PoolClient,
  ): Promise<ServiceResponse<any>>;

  authenticate(
    ctx: DB_RequestContext,
    payload: any,
    client?: PoolClient,
  ): Promise<ServiceResponse<any>>;

  verify(
    ctx: DB_RequestContext,
    payload: any,
    client?: PoolClient,
  ): Promise<ServiceResponse<any>>;

  revoke(
    ctx: DB_RequestContext,
    payload: any,
    client?: PoolClient,
  ): Promise<ServiceResponse<void>>;

  update(
    ctx: DB_RequestContext,
    payload: any,
    client?: PoolClient,
  ): Promise<ServiceResponse<void>>;
}
