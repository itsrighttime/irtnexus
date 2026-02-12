// server/irt-devServer.js
import https from "https";
import fs from "fs";
import express from "express";
import { SecureChannelHandler } from "./secureChannelHandler.js";
import { PolicyEngine } from "./policyEngine.js";
import { SecurityAdvisoryEngine } from "./securityAdvisoryEngine.js";
import { CacheManager } from "./cacheManager.js";
import { logger } from "./helpers/logger.js";
import { HEADERS } from "#config";

export class irt-devServer {
  /**
   * @param {Object} options
   * @param {string} options.tlsKeyPath - Path to TLS private key
   * @param {string} options.tlsCertPath - Path to TLS certificate
   * @param {Object} options.tenantsConfig - Tenant-specific configs
   */
  constructor({ tlsKeyPath, tlsCertPath, tenantsConfig }) {
    this.tenantsConfig = tenantsConfig;
    this.app = express();
    this.app.use(express.json());

    // Setup HTTPS credentials
    this.credentials = {
      key: fs.readFileSync(tlsKeyPath),
      cert: fs.readFileSync(tlsCertPath),
    };

    // Setup server-side SecureChannelHandlers per tenant
    this.secureChannels = new Map();
    this.caches = new Map();

    for (const [tenantId, config] of Object.entries(tenantsConfig)) {
      this.secureChannels.set(
        tenantId,
        new SecureChannelHandler({
          serverPrivateKey: config.serverPrivateKey,
          clientPublicKey: config.clientPublicKey,
        }),
      );

      this.caches.set(
        tenantId,
        new CacheManager({
          enabled: config.decisionCaching,
          ttl: config.cacheTTLSeconds || 60,
        }),
      );
    }

    this._setupRoutes();
  }

  _setupRoutes() {
    this.app.post("/api/secure-request", async (req, res) => {
      try {
        const tenantId = req.headers[HEADERS.TANENT_ID];
        if (!tenantId || !this.secureChannels.has(tenantId)) {
          return res.status(400).send({ message: "Invalid tenant" });
        }

        const channel = this.secureChannels.get(tenantId);
        const cache = this.caches.get(tenantId);

        const decrypted = channel.decryptAndVerifyRequest(req.body);

        if (decrypted.status === "compromised") {
          return res.status(400).send(decrypted);
        }

        // Check cache first
        const cacheKey = `${decrypted.userId}:${decrypted.resource}:${decrypted.action}`;
        let decision = cache.get(cacheKey);

        if (!decision) {
          // Evaluate policy
          decision = PolicyEngine.evaluate(
            decrypted.userId,
            decrypted.resource,
            decrypted.action,
          );

          // Evaluate security advisory
          const advisory = SecurityAdvisoryEngine.evaluate(
            decrypted.userId,
            decrypted.resource,
            decrypted.action,
            decrypted.metadata,
          );

          decision.advisory = advisory;

          // Store in cache
          cache.set(cacheKey, decision);
        }

        const responsePayload = {
          decision,
          timestamp: Date.now(),
          nonce: crypto.randomUUID(),
        };

        const secureResponse = channel.encryptAndSignResponse(responsePayload);

        res.send(secureResponse);
      } catch (err) {
        logger.error("[irt-devServer] Error handling request", err);
        logger.error(err);
        res.status(500).send({ message: "Internal server error" });
      }
    });
  }

  /**
   * Start HTTPS server
   */
  start(port = 443) {
    this.server = https.createServer(this.credentials, this.app);
    this.server.listen(port, () => {
      logger.info(`[irt-devServer] Listening on port ${port}`);
    });
  }
}
