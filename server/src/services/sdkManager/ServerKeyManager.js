// server/keyManager.js
import { generateKeyPairSync } from "crypto";
import { existsSync, mkdirSync, writeFileSync, readFileSync } from "fs";
import { join } from "path";
import { logger } from "./helpers/logger.js";

export class ServerKeyManager {
  /**
   * @param {Object} options
   * @param {string} options.basePath - Base path to store tenant keys
   * @param {number} options.rotationPeriodDays - Auto-rotate keys after N days
   */
  constructor({
    basePath = "./.irt-dev_server_keys",
    rotationPeriodDays = 90,
  } = {}) {
    this.basePath = basePath;
    this.rotationPeriodDays = rotationPeriodDays;

    if (!existsSync(this.basePath))
      mkdirSync(this.basePath, { recursive: true });
  }

  /**
   * Generate signing + encryption key pair for a tenant
   * @param {string} tenantId
   */
  generateTenantKeys(tenantId) {
    const tenantPath = join(this.basePath, tenantId);
    if (!existsSync(tenantPath)) mkdirSync(tenantPath, { recursive: true });

    // Signing Key Pair
    const signing = generateKeyPairSync("rsa", { modulusLength: 4096 });
    writeFileSync(
      join(tenantPath, "signing_private.pem"),
      signing.privateKey.export({ type: "pkcs1", format: "pem" })
    );
    writeFileSync(
      join(tenantPath, "signing_public.pem"),
      signing.publicKey.export({ type: "pkcs1", format: "pem" })
    );

    // Encryption Key Pair
    const encryption = generateKeyPairSync("rsa", { modulusLength: 4096 });
    writeFileSync(
      join(tenantPath, "encryption_private.pem"),
      encryption.privateKey.export({ type: "pkcs1", format: "pem" })
    );
    writeFileSync(
      join(tenantPath, "encryption_public.pem"),
      encryption.publicKey.export({ type: "pkcs1", format: "pem" })
    );

    logger.info(`[ServerKeyManager] Generated keys for tenant ${tenantId}`);
  }

  /**
   * Load private/public keys for a tenant
   * @param {string} tenantId
   */
  loadTenantKeys(tenantId) {
    const tenantPath = join(this.basePath, tenantId);
    if (!existsSync(tenantPath))
      throw new Error(`Tenant ${tenantId} not found`);

    const keys = {
      signingPrivateKey: readFileSync(
        join(tenantPath, "signing_private.pem"),
        "utf-8"
      ),
      signingPublicKey: readFileSync(
        join(tenantPath, "signing_public.pem"),
        "utf-8"
      ),
      encryptionPrivateKey: readFileSync(
        join(tenantPath, "encryption_private.pem"),
        "utf-8"
      ),
      encryptionPublicKey: readFileSync(
        join(tenantPath, "encryption_public.pem"),
        "utf-8"
      ),
    };

    return keys;
  }

  /**
   * Check if keys exist for a tenant
   */
  tenantKeysExist(tenantId) {
    const tenantPath = join(this.basePath, tenantId);
    return (
      existsSync(join(tenantPath, "signing_private.pem")) &&
      existsSync(join(tenantPath, "signing_public.pem")) &&
      existsSync(join(tenantPath, "encryption_private.pem")) &&
      existsSync(join(tenantPath, "encryption_public.pem"))
    );
  }

  /**
   * Ensure keys exist for tenant; rotate if needed
   */
  ensureTenantKeys(tenantId) {
    if (!this.tenantKeysExist(tenantId)) {
      logger.info(
        `[ServerKeyManager] Keys missing for tenant ${tenantId}, generating...`
      );
      this.generateTenantKeys(tenantId);
    } else if (this._needsRotation(tenantId)) {
      logger.info(`[ServerKeyManager] Rotating keys for tenant ${tenantId}`);
      this.generateTenantKeys(tenantId);
      this._updateRotationTimestamp(tenantId);
    }
  }

  _rotationFile(tenantId) {
    return join(this.basePath, tenantId, "rotation_meta.json");
  }

  _updateRotationTimestamp(tenantId) {
    const rotationFile = this._rotationFile(tenantId);
    const meta = { lastRotated: Date.now() };
    writeFileSync(rotationFile, JSON.stringify(meta, null, 2));
  }

  _loadRotationMeta(tenantId) {
    const rotationFile = this._rotationFile(tenantId);
    if (!existsSync(rotationFile)) return { lastRotated: 0 };
    try {
      return JSON.parse(readFileSync(rotationFile, "utf-8"));
    } catch {
      return { lastRotated: 0 };
    }
  }

  _needsRotation(tenantId) {
    const meta = this._loadRotationMeta(tenantId);
    const periodMs = this.rotationPeriodDays * 24 * 60 * 60 * 1000;
    return Date.now() - meta.lastRotated >= periodMs;
  }
}
