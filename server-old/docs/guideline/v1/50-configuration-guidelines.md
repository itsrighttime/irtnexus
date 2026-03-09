# Configuration Guidelines

## Purpose

This document defines **standards for application configuration** to ensure:

- Predictable deployments
- Security of sensitive values
- Separation between environments
- Ease of management

Configuration is **not code**, and **must not be hard-coded**.

## Core Principles

1. **Environment-Specific Configurations**
   - Config values must vary per environment (dev, staging, prod)
   - Use `.env` files or secret management systems

2. **Centralized Config Management**
   - All config values must be defined in `/config` folder
   - No scattered constants in services, controllers, or queries

3. **Immutable at Runtime**
   - Once the application starts, configuration should not change dynamically
   - Exceptions: runtime flags designed explicitly for dynamic reload

4. **Sensitive Values Must Be Secured**
   - Secrets, API keys, DB passwords must never be committed to source control
   - Use `.env`, secret managers, or vaults

## Configuration Structure

The `/config` folder must be organized by **context and type**:

```
/config
  ├─ db.js              # database connection config
  ├─ i18n.js            # language & translations config
  ├─ cors.js            # CORS policy
  ├─ session.js         # session management
  ├─ logger.js          # logging configuration
  ├─ server.js          # server-level config (port, timeouts)
  ├─ index.js           # central export
```

Each module should export **functions or objects**, not execute logic.

## Environment Variables

- All dynamic values must come from environment variables
- Use `.env` file for local development
- Required variables must fail fast if missing

Example:

```env
PORT=5001
SESSION_SECRET=secureRandomString
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=secret
```

Rules:

- `.env` files for dev only
- Never commit `.env.production` with secrets
- Document required variables

## Loading Configurations

- Use a central `index.js` in `/config` to load and export all configs

Example:

```js
import db from "./db.js";
import session from "./session.js";
import i18n from "./i18n.js";

export { db, session, i18n };
```

- Services, controllers, and middlewares **must import from `/config` only**

## Runtime Overrides

- Avoid runtime overrides unless required
- Any dynamic configuration must be **explicitly documented**
- Use feature flags or toggle systems if runtime change is necessary

## Validation of Config

- On app start, validate critical config values
- Throw descriptive errors if required environment variables are missing

Example:

```js
if (!process.env.DB_HOST) {
  throw new Error("DB_HOST environment variable is required");
}
```

## Secrets & Sensitive Config

- Never log sensitive config
- Avoid embedding secrets in code
- Use encryption or secret managers for production secrets

## Versioning & Environment Separation

- Each environment must have **distinct config**
- Keep staging and production separate
- Config changes must be reviewed and versioned

## Anti-Patterns (Strictly Forbidden)

- Hard-coding URLs, secrets, or API keys in code
- Scattering configuration across multiple folders
- Loading config inside controllers or services
- Relying on defaults for critical variables

## Review Checklist

- All critical values are environment-based
- `/config` folder contains all centralized config
- No secrets in source control
- Validation exists for required config
- Controllers/services import only from `/config`

## Summary

Configuration is **the backbone of safe, predictable deployments**.
Centralize, validate, secure, and version all config.
