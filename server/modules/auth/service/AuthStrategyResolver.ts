import { DB_RequestContext } from "#packages/database";
import { ServiceResponse } from "#types";
import { PoolClient } from "pg";
import { authStrategyRegistry } from "./AuthStrategyRegistry";
import { AuthStrategyMethods } from "../const";

export class AuthStrategyResolver {
  async setup(
    strategyType: AuthStrategyMethods,
    ctx: DB_RequestContext,
    payload: any,
    client?: PoolClient,
  ): Promise<ServiceResponse<any>> {
    const strategy = authStrategyRegistry.get(strategyType);
    return strategy.setup(ctx, payload, client);
  }

  async authenticate(
    strategyType: AuthStrategyMethods,
    ctx: DB_RequestContext,
    payload: any,
    client?: PoolClient,
  ): Promise<ServiceResponse<any>> {
    const strategy = authStrategyRegistry.get(strategyType);
    return strategy.authenticate(ctx, payload, client);
  }

  async verify(
    strategyType: AuthStrategyMethods,
    ctx: DB_RequestContext,
    payload: any,
    client?: PoolClient,
  ): Promise<ServiceResponse<any>> {
    const strategy = authStrategyRegistry.get(strategyType);
    return strategy.verify(ctx, payload, client);
  }

  async revoke(
    strategyType: AuthStrategyMethods,
    ctx: DB_RequestContext,
    payload: any,
    client?: PoolClient,
  ): Promise<ServiceResponse<void>> {
    const strategy = authStrategyRegistry.get(strategyType);
    return strategy.revoke(ctx, payload, client);
  }

  async update(
    strategyType: AuthStrategyMethods,
    ctx: DB_RequestContext,
    payload: any,
    client?: PoolClient,
  ): Promise<ServiceResponse<void>> {
    const strategy = authStrategyRegistry.get(strategyType);
    return strategy.update(ctx, payload, client);
  }
}

export const authResolver = new AuthStrategyResolver();
