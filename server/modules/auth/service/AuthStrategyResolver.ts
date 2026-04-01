import { AuthStrategy } from "../types";

class AuthStrategyResolver {
  private strategies = new Map<string, AuthStrategy>();

  register(type: string, strategy: AuthStrategy) {
    this.strategies.set(type, strategy);
  }

  get(type: string): AuthStrategy {
    const strategy = this.strategies.get(type);
    if (!strategy) {
      throw new Error(`Strategy not found: ${type}`);
    }
    return strategy;
  }
}
