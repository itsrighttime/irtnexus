# `@irtnexus/i18n` Developer Guide

This package provides **centralized, modular internationalization** for the `irtnexus` monolith, aggregating translations from all modules.

## 1 Exposed API

| Export                                          | Purpose                                                                                                        |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `initI18n(modulesPath: string)`                 | Initialize i18next and load all module translations.                                                           |
| `i18n`                                          | The underlying `i18next` instance for advanced use.                                                            |
| `t(key: string, options?: Record<string, any>)` | Safe translation helper. Use instead of `i18n.t()`.                                                            |
| `validateTranslations(modulesPath: string)`     | Validate that all translations have consistent keys across languages. Can be used programmatically or via CLI. |

## 2 Folder Structure for Translations

Each module owns its translations in its **interface layer**:

```text
modules/
  projects/
    interface/
      i18n/
        en.json
        hi.json
  hr/
    interface/
      i18n/
        en.json
```

Example `en.json`:

```json
{
  "project": {
    "created": "Project created successfully",
    "notFound": "Project not found"
  }
}
```

## 3 Initializing i18n

Call `initI18n()` in your app entry point (e.g., `apps/rest-server/src/app.ts`):

```ts
import { initI18n } from "@irtnexus/i18n";

async function bootstrap() {
  // Load all translations from modules folder
  await initI18n("modules");

  // Continue with app initialization
}

bootstrap();
```

- `modulesPath` is the path to your modules folder.
- All JSON files inside `interface/i18n` are merged per language.
- Default fallback language is `en`.

## 4 Using Translations

Use the `t()` helper:

```ts
import { t } from "@irtnexus/i18n";

// Example in a controller
reply.send({
  message: t("project.created"), // => "Project created successfully"
});
```

Supports:

- **Nested keys**: `t("project.notFound")`
- **Interpolation**:

```ts
t("project.welcomeUser", { name: "Alice" });
```

Where JSON contains:

```json
{
  "project": {
    "welcomeUser": "Welcome, {{name}}!"
  }
}
```

## 5 Using `i18n` Directly

If needed, you can use the `i18n` instance directly for advanced features:

```ts
import { i18n } from "@irtnexus/i18n";

// Change language at runtime
i18n.changeLanguage("hi");

// Check if a key exists
const exists = i18n.exists("project.created");
```

## 6 Validating Translations

`validateTranslations()` ensures that **all language files in modules have consistent keys**.

### CLI Usage

```bash
pnpm run i18n:validate
```

- Scans all modules in `modules/` folder
- Prints missing keys per language
- Exits with **non-zero code** if validation fails (CI-friendly)

### Programmatic Usage

```ts
import { validateTranslations } from "@irtnexus/i18n";

const valid = validateTranslations("modules");

if (!valid) {
  console.error("Translations validation failed!");
  process.exit(1);
}
```

## 7 Best Practices

### Domain Layer

- **Do not use `t()`** in the domain layer.
- Domain should throw **errors or domain events** instead:

```ts
throw new ProjectNotFoundError();
```

### Controller / Interface Layer

- Translate domain errors for end-users:

```ts
if (error instanceof ProjectNotFoundError) {
  reply.status(404).send({ message: t("project.notFound") });
}
```

### Namespaces (Optional)

Avoid key collisions by namespacing:

```json
{
  "projects": {
    "created": "Project created successfully"
  }
}
```

Access via:

```ts
t("projects.created");
```

## 8 Directory Flow

```text
modules/
  <module>/
    interface/
      i18n/
        <lang>.json
packages/
  i18n/
    core/
      i18n-instance.ts
      init-i18n.ts
    helper/
      translate.ts
      validate-translations.ts
apps/
  rest-server/
    src/
      app.ts  # initialize i18n here
```

## 9 Summary

- **Module owns translations**
- **i18n package aggregates them**
- **Domain layer stays pure**
- **Controllers translate for users**
- Supports **multiple languages**, **nested keys**, and **interpolation**
- Provides **validation for consistency**

This ensures **high cohesion, low coupling**, and **scalable modular i18n**.
