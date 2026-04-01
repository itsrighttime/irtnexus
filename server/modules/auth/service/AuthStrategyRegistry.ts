import { AUTH_STRATEGY_METHODS, type AuthStrategyMethods } from "../const";
import { AuthStrategy } from "../types";
import { PasswordlessStrategy, PasswordStrategy } from "./stretegies";

class AuthStrategyRegistry {
  private strategies: Map<AuthStrategyMethods, AuthStrategy>;

  constructor() {
    this.strategies = new Map();

    this.register(AUTH_STRATEGY_METHODS.PASSWORD, new PasswordStrategy());
    this.register(
      AUTH_STRATEGY_METHODS.PASSWORDLESS,
      new PasswordlessStrategy(),
    );
  }

  register(type: AuthStrategyMethods, strategy: AuthStrategy) {
    this.strategies.set(type, strategy);
  }

  get(type: AuthStrategyMethods): AuthStrategy {
    const strategy = this.strategies.get(type);

    if (!strategy) {
      throw new Error(`Strategy not found for type: ${type}`);
    }

    return strategy;
  }
}

export const authStrategyRegistry = new AuthStrategyRegistry();
