# Translation & Internationalization Guidelines

## Purpose

This document defines the **standards for supporting multiple languages** across the system.

Goals:

- Ensure consistent translation management
- Avoid hard-coded strings in code
- Enable easy addition of new languages
- Support proper localization in responses and error messages

## Core Principles

1. **No Hard-Coded Strings**
   - All user-facing text must go through the translation system
   - This includes responses, errors, emails, notifications, and logs intended for end-users

2. **Centralized Translation Files**
   - Store all translations under `/translations`
   - Structure must be context-based

3. **Language Detection & Context**
   - Use `languageMiddleware` to detect client language
   - Use `getLanguageContext()` to retrieve the active language in services or controllers

## Folder Structure

```
/translations
  ├─ en/
  │    ├─ user.json
  │    ├─ errors.json
  │    └─ notifications.json
  ├─ fr/
  │    ├─ user.json
  │    ├─ errors.json
  │    └─ notifications.json
  └─ index.js
```

- Top-level folder per language (e.g., `en`, `fr`)
- Context-specific files inside each language folder (user, errors, notifications, etc.)
- `index.js` exports the translation loader

## Translation Keys

- Use **semantic keys**, not full English text, e.g., `user.already_exists`
- Keys should match the **context of usage**
- Avoid duplication of keys across files

Example:

```json
{
  "user": {
    "already_exists": "User already exists",
    "created": "User successfully created"
  }
}
```

## Translation Usage in Code

Use the `translate` function to fetch localized text:

```js
import { translate } from "#translations";

const message = translate("user.already_exists", { name: "Email" });
```

Rules:

- Always pass `req.context` or rely on `languageMiddleware` to detect language
- Do not concatenate translated strings in code
- Parameterize dynamic content using placeholders

## Adding a New Language

1. Create a new folder for the language code (e.g., `es` for Spanish)
2. Copy existing JSON files from `en/` as template
3. Translate all keys
4. Test with `languageMiddleware` and `getLanguageContext()`

## Error & Response Translation

- All domain errors **must be translated** before sending to clients
- Never return raw error messages from services or DB
- Use `translate` with keys instead of inline messages

## Translation Maintenance

- Keep English (`en`) as **source of truth**
- All other languages must remain consistent with `en` keys
- Missing translations must **fallback to English**
- Avoid duplication across contexts

## Anti-Patterns (Strictly Forbidden)

- Hard-coded messages in controllers or services
- Concatenating multiple translated strings at runtime
- Returning untranslated error messages
- Storing translations outside `/translations`

## Review Checklist

- All user-facing strings pass through `translate`
- Translation keys are semantic and context-specific
- Language detection is correctly implemented
- Fallback to English exists for missing translations

## Summary

Translations are **critical for a global-ready system**.
Follow these rules to maintain consistency, avoid leaks, and ensure multi-language support.
