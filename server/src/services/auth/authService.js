import PasswordStrategy from "./strategies/password.js";
import MagicLinkStrategy from "./strategies/magicLink.js";
import OtpStrategy from "./strategies/otp.js";
import TotpStrategy from "./strategies/totp.js";
import PasskeyStrategy from "./strategies/passkey.js";
import PushStrategy from "./strategies/push.js";
import BackupCodesStrategy from "./strategies/backupCodes.js";
import SsoStrategy from "./strategies/sso.js";
import FederatedIdentityStrategy from "./strategies/federatedIdentity.js";
import ApiKeysStrategy from "./strategies/apiKeys.js";
import OauthTokensStrategy from "./strategies/oauthTokens.js";
import SignedTokensStrategy from "./strategies/signedTokens.js";
import LegacyPasswordStrategy from "./strategies/legacyPassword.js";
import AdaptiveStrategy from "./strategies/adaptive.js";
import HardwareKeysStrategy from "./strategies/hardwareKeys.js";
import QrLoginStrategy from "./strategies/qrLogin.js";
import SessionPinStrategy from "./strategies/sessionPin.js";

class AuthService {
  constructor() {
    this.strategies = {
      password: new PasswordStrategy(),
      magicLink: new MagicLinkStrategy(),
      otp: new OtpStrategy(),
      totp: new TotpStrategy(),
      passkey: new PasskeyStrategy(),
      push: new PushStrategy(),
      backupCodes: new BackupCodesStrategy(),
      sso: new SsoStrategy(),
      federatedIdentity: new FederatedIdentityStrategy(),
      apiKeys: new ApiKeysStrategy(),
      oauthTokens: new OauthTokensStrategy(),
      signedTokens: new SignedTokensStrategy(),
      legacyPassword: new LegacyPasswordStrategy(),
      adaptive: new AdaptiveStrategy(),
      hardwareKeys: new HardwareKeysStrategy(),
      qrLogin: new QrLoginStrategy(),
      sessionPin: new SessionPinStrategy(),
    };
  }

  async setup(userId, method, payload) {
    if (!this.strategies[method]) throw new Error("Auth method not supported");
    return this.strategies[method].setup(userId, payload);
  }

  async authenticate(identifier, method, payload) {
    if (!this.strategies[method]) throw new Error("Auth method not supported");
    return this.strategies[method].authenticate(identifier, payload);
  }

  async update(userId, method, payload) {
    if (!this.strategies[method]) throw new Error("Auth method not supported");
    return this.strategies[method].update(userId, payload);
  }

  async revoke(userId, method, payload) {
    if (!this.strategies[method]) throw new Error("Auth method not supported");
    return this.strategies[method].revoke(userId, payload);
  }
}

export const authService = new AuthService();
