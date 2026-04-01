import { AUTH_STRATEGY, AuthStrategyType } from "../const";
import { AuthStrategy } from "../types";
import { PasswordlessStrategy, PasswordStrategy } from "./stretegies";

class AuthStrategyRegistry {
  private strategies: Map<AuthStrategyType, AuthStrategy>;

  constructor() {
    this.strategies = new Map();

    this.register(AUTH_STRATEGY.PASSWORD, new PasswordStrategy());
    this.register(AUTH_STRATEGY.PASSWORDLESS, new PasswordlessStrategy());
  }

  register(type: AuthStrategyType, strategy: AuthStrategy) {
    this.strategies.set(type, strategy);
  }

  get(type: AuthStrategyType): AuthStrategy {
    const strategy = this.strategies.get(type);

    if (!strategy) {
      throw new Error(`Strategy not found for type: ${type}`);
    }
 
    return strategy;
  }
}

export const authStrategyRegistry = new AuthStrategyRegistry();
