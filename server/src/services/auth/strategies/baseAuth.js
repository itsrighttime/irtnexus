import { opDb } from "#database";

export class BaseAuthStrategy {
  constructor() {
    this.type = "primary"; // or "secondary"
  }

  async setup(userId, payload) {
    throw new Error("setup() not implemented");
  }

  async authenticate(identifier, payload) {
    throw new Error("authenticate() not implemented");
  }

  async verify(identifier, payload) {
    // used for second step verification (OTP etc.)
    throw new Error("verify() not implemented");
  }

  async revoke(userId) {
    throw new Error("revoke() not implemented");
  }

  async update(userId, payload) {
    throw new Error("update() Not implemented");
  }

  async withTransaction(externalConn, callback) {
    if (externalConn) {
      // Already inside a transaction
      return callback(externalConn);
    }

    // Start a new transaction
    return opDb.transaction(async (conn) => {
      return callback(conn);
    });
  }
}
