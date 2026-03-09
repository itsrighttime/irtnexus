# Package & Dependency Guidelines

## Purpose

This document defines **how packages are managed, organized, and used** to ensure:

- Security and stability
- Consistency across the system
- Avoidance of dependency bloat
- Clear separation between internal and external packages

## Core Principles

1. **Centralized Package Management**
   - All external packages must be installed via `package.json`
   - No manual copying of packages or scripts into code

2. **Use Scoped Internal Packages**
   - Any reusable internal logic should be packaged under `/packages`
   - Reuse across services instead of duplicating code

3. **Minimal & Secure Dependencies**
   - Only install packages that are necessary
   - Regularly audit for vulnerabilities (`npm audit` / `yarn audit`)

4. **Version Pinning**
   - Avoid floating versions (`^`, `~`) for production-critical packages
   - Ensure predictable builds and deployments

## Folder Structure

```
/packages
  ├─ utils/             # reusable utility functions
  ├─ validator/         # internal validator package
  ├─ auth/              # reusable authentication helpers
  └─ index.js           # exports internal packages
```

Rules:

- All internal packages are **imported via aliases** (`#packages/...`)
- Internal packages must **not contain application-specific logic**
- Internal packages should be **well-documented and tested**

## Installing Third-Party Packages

- Use **official packages** from NPM or trusted registries
- Verify license compatibility (avoid restrictive licenses)
- Document the purpose of new packages in PRs or internal docs
- Avoid packages that overlap significantly with existing internal logic

## Updating Packages

- Follow a **review and test process** for updates
- Minor updates: patch vulnerabilities or bug fixes
- Major updates: require regression testing
- Update internal packages via versioning and change logs

## Package Usage Guidelines

- **Import only what is needed**
- Avoid global polyfills or monkey-patching
- Do not import entire libraries if only one function is needed
- Internal packages must **not depend on specific controllers or services**

## Security & Audit

- Scan all dependencies for vulnerabilities
- Remove unused packages promptly
- Internal packages must **not include secrets**
- Do not rely on deprecated or unmaintained packages

## Anti-Patterns (Strictly Forbidden)

- Copying third-party code into `/utils` instead of using NPM
- Mixing internal logic with third-party packages
- Overwriting prototypes of native objects globally
- Ignoring `npm audit` warnings for critical vulnerabilities

## Review Checklist

- Packages are centralized in `/packages` or `package.json`
- Only approved external packages are used
- Internal packages are context-agnostic and reusable
- Versioning and changelogs exist for internal packages
- Security audit passed for all dependencies

## Summary

Packages are **the building blocks of the system**.
Follow these rules to ensure **reusable, secure, and maintainable code**.
