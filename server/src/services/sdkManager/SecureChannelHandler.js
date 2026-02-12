// server/secureChannelHandler.js
import crypto from "crypto";
import { logger } from "./helpers/logger.js";

/**
 * SecureChannelHandler - Handles encrypted & signed requests from clients
 */
export class SecureChannelHandler {
  /**
   * @param {Object} options
   * @param {string} options.serverPrivateKey - PEM private key of irt-dev server
   * @param {string} options.clientPublicKey - PEM public key of the client
   */
  constructor({ serverPrivateKey, clientPublicKey }) {
    if (!serverPrivateKey || !clientPublicKey)
      throw new Error("Server private key and client public key are required");

    this.serverPrivateKey = serverPrivateKey;
    this.clientPublicKey = clientPublicKey;

    this.nonceStore = new Map();
    this.nonceTTL = 30000; // 30 seconds default
  }

  /**
   * Decrypt and verify an incoming request
   * @param {Object} payload - { encryptedPayload: string, signature: string }
   * @returns {Object} - decrypted JSON payload or error info
   */
  decryptAndVerifyRequest({ encryptedPayload, signature }) {
    const encryptedBuffer = Buffer.from(encryptedPayload, "base64");
    const signatureBuffer = Buffer.from(signature, "base64");

    if (!this._verifySignature(encryptedBuffer, signatureBuffer)) {
      logger.warn("[SecureChannelHandler] Invalid signature detected");
      return { status: "compromised", message: "Invalid signature" };
    }

    const decrypted = this._decryptPayload(encryptedBuffer);
    if (!decrypted) {
      return { status: "compromised", message: "Decryption failed" };
    }

    if (
      !this._validateTimestampAndNonce(decrypted.timestamp, decrypted.nonce)
    ) {
      logger.warn("[SecureChannelHandler] Replay attack or invalid timestamp");
      return { status: "compromised", message: "Replay attack detected" };
    }

    return decrypted;
  }

  /**
   * Encrypt and sign a response to send to client
   * @param {Object} payload - JSON object
   * @returns {Object} - { encryptedPayload, signature }
   */
  encryptAndSignResponse(payload) {
    const jsonPayload = JSON.stringify(payload);
    const encrypted = this._encryptPayload(jsonPayload);
    const signature = this._signPayload(encrypted);

    return {
      encryptedPayload: encrypted.toString("base64"),
      signature: signature.toString("base64"),
    };
  }

  /**
   * -------------------------
   * 🔒 Private crypto helpers
   * -------------------------
   */

  _encryptPayload(plainText) {
    return crypto.publicEncrypt(this.clientPublicKey, Buffer.from(plainText));
  }

  _decryptPayload(encryptedBuffer) {
    try {
      const decryptedBuffer = crypto.privateDecrypt(
        this.serverPrivateKey,
        encryptedBuffer,
      );
      return JSON.parse(decryptedBuffer.toString("utf-8"));
    } catch (err) {
      logger.error("[SecureChannelHandler] Decryption failed");
      logger.error(err);
      return null;
    }
  }

  _signPayload(encryptedBuffer) {
    return crypto.sign("sha512", encryptedBuffer, {
      key: this.serverPrivateKey,
      padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
    });
  }

  _verifySignature(encryptedBuffer, signatureBuffer) {
    return crypto.verify(
      "sha512",
      encryptedBuffer,
      {
        key: this.clientPublicKey,
        padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
      },
      signatureBuffer,
    );
  }

  /**
   * -------------------------
   * 🛡️ Basic replay protection
   * -------------------------
   */
  _validateTimestampAndNonce(timestamp, nonce) {
    const now = Date.now();
    const allowedDriftMs = 30000;

    if (!timestamp || Math.abs(now - timestamp) > allowedDriftMs) return false;
    if (!nonce || typeof nonce !== "string" || nonce.length < 20) return false;
    if (this.nonceStore.has(nonce)) return false;

    // store nonce with expiry
    this.nonceStore.set(nonce, now + this.nonceTTL);

    // cleanup old nonces
    for (const [storedNonce, expiry] of this.nonceStore.entries()) {
      if (expiry < now) this.nonceStore.delete(storedNonce);
    }

    return true;
  }
}
