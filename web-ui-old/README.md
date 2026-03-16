## Project Guidelines

- **No hardcoded labels or text**: All user-visible content (buttons, labels, placeholders, etc.) must be referenced via the translations system.
- **Use absolute imports** as per configured paths (avoid relative imports like `../../../`).
- **Modularize components**: Reusable, generic UI elements should go under `/components/`, not `/widgets/` or `/pages/`.
- **Avoid business logic in UI components**: Move processing logic to `/services/` or `/utils/`.
- **Centralize configurations**: Global configurations (themes, env-specific data) must reside inside `/configs/`.
- **Use Context or State Stores for global state**: Prefer `/contexts/` for React Context and `/stores/` for Zustand or Redux.
- **Keep pages lightweight**: Pages should primarily focus on UI composition using components and widgets.
- **Translations-first development**: All UI text must pull from the `/translations/` system using translation hooks.

## Folder Usage & Responsibilities

| **Folder**      | **Purpose & When to Use**                                                                                   |
| --------------- | ----------------------------------------------------------------------------------------------------------- |
| `#api`          | API-related logic. Place API fetchers, axios configs, and REST endpoints here. Centralized data fetching.   |
| `#assets`       | Static files like images, fonts, icons, and other non-JS assets.                                            |
| `#components`   | Pure, reusable UI components (Button, Input, Modal). Generic building blocks without business logic.        |
| `#configs`      | App-level configurations (themes, environment settings). Used for data like default settings, constants.    |
| `#constants`    | Centralized constant variables used across the app (roles, statuses).                                       |
| `#contexts`     | React Contexts. Place authentication, language, or theme contexts here. Used for app-wide state sharing.    |
| `#hooks`        | Custom React hooks. Place reusable hooks like `useAuth`, `useFetch`, `useDebounce` here.                    |
| `#layouts`      | Layout components (wrappers like Header/Footer/Sidebar). Compose page layouts here.                         |
| `#pages`        | Route-level components. Place entire pages/screens (e.g., LoginPage, DashboardPage) here.                   |
| `#routes`       | React Router configurations and route guards (ProtectedRoute, etc.).                                        |
| `#services`     | Business logic and process-layer code (e.g., token handling, service calls). Use for reusable domain logic. |
| `#stores`       | Global state management. Use Zustand/Redux stores here for application-wide state.                          |
| `#styles`       | Global CSS/SCSS files or shared style modules.                                                              |
| `#translations` | JSON files containing language translations. All UI-visible text should come from here.                     |
| `#utils`        | Pure helper functions (formatting, calculations). Keep functional, stateless utilities here.                |
| `#widgets`      | Feature-heavy or domain-specific components (charts, dashboards, cards). Distinct from small UI elements.   |

## Example: How to Use Absolute Imports

Instead of:

```jsx
import Button from "../../../components/Button";
```

Use:

```jsx
import Button from "#components/Button";
```

## Language & Text Usage

- Example usage in components:

```jsx
import { useTranslation } from "#contexts/TranslationContext";

const LoginForm = () => {
  const { t } = useTranslation();

  return <button>{t("buttons.submit")}</button>;
};
```

All visible strings must be stored in `/translations/{language}.json`.

## Summary

- **Keep UI simple and dumb.**
- **Handle logic in services.**
- **Never hardcode content.**
- **Reuse components and avoid duplication.**
- **Respect folder boundaries.**

> **Note:** Before adding a new folder, check if the responsibility fits into an existing one to avoid unnecessary fragmentation.
