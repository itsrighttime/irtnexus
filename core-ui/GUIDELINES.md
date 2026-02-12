# Cross-Platform Project Guidelines

_(Baseline Documentation for All Teams)_

## 1. Project Philosophy

- **Separation of Concerns:**
  - Web UI repo → Only for browser-based components & styling.
  - Native UI repo → Only for React Native components & styling.
  - Core repo → Business logic, Redux store, slices, API handling, utilities.
- **Reusability First:** All logic must live in Core. UIs must never reimplement logic.
- **Platform-Specific Rendering:** UIs must only focus on platform rendering, accessibility, and UX.

## 2. Repository Responsibilities

### Core Repo

- **Owns:**
  - Redux store, slices, and middleware
  - API client & services
  - Business logic & domain models
  - Custom hooks (e.g., `useAuth`, `useUsers`)
  - Shared utilities (validation, constants, formatters)
- **Rules:**
  - No React DOM or React Native imports.
  - Must remain platform-agnostic (pure JS/TS).
  - Provide clear, versioned public API (hooks, selectors, actions) for UI teams.
  - All exports go through `index.ts` (for clean imports).

### Web UI Repo

- **Owns:**
  - Web-only components (`<Button>`, `<Header>`, `<Form>`)
  - Styling via CSS-in-JS, Tailwind, or CSS modules
  - Routing (`react-router-dom`)
  - Accessibility and responsive design
- **Rules:**
  - Must consume state/hooks only from Core.
  - Must not include API logic directly.
  - Avoid business logic inside components (delegate to Core hooks).
  - Follow UI design system guidelines (consistency across all components).

### Native UI Repo

- **Owns:**
  - React Native-only components (`<View>`, `<Text>`, `<Button>`)
  - Styling via React Native `StyleSheet` or `styled-components/native`
  - Navigation (`react-navigation`)
  - Mobile-specific patterns (gesture handling, device APIs, native modules)
- **Rules:**
  - Must consume state/hooks only from Core.
  - Must not include API logic directly.
  - Avoid duplicating business logic (delegate to Core hooks).
  - Follow mobile design system (platform look & feel).

## 3. Development Workflow

1. **Core publishes new version**
   - Core team releases updates to `@company/core` on NPM/registry.
   - Versions must follow semantic versioning (MAJOR.MINOR.PATCH).
2. **UI teams consume Core**
   - Web/Native repos install `@company/core` versioned dependency.
   - Upgrade only when ready (decoupled release cycles).
3. **Branching & PR rules**
   - All teams follow feature branch → PR → main.
   - PRs require review by at least one peer.
4. **Testing**
   - Core: Unit tests for slices, hooks, API.
   - Web UI: Component/unit tests, accessibility checks.
   - Native UI: Component/unit tests, device emulator testing.

## 4. Coding Standards

- **Language:** TypeScript across all repos.
- **Linting:** ESLint + Prettier with shared config across repos.
- **Naming conventions:**
  - Components: PascalCase
  - Hooks: `useSomething`
  - Redux slices: `featureSlice.js`
  - Constants: UPPER_SNAKE_CASE
- **Imports:** Always via public exports (`index.ts`) to avoid deep imports.

## 5. Communication Contracts Between Teams

- **Core → UI teams:**
  - Expose hooks (`useAuth`, `useUsers`, `useSettings`)
  - Provide selectors (`selectUser`, `selectSettings`)
  - Document expected input/output of APIs
- **UI teams → Core team:**
  - Raise issues if API needs change
  - Never bypass Core to make API calls directly
  - Request new hooks/selectors via tickets
- **Design consistency:**
  - Web UI and Native UI teams follow a shared design system (colors, spacing, typography tokens)
  - Components may differ visually per platform but must respect the same design language

## 6. Deployment & Releases

- **Core:** Published as NPM package (`@company/core`)
- **Web UI:** Deployed to web hosting/CDN (Vercel, Netlify, S3)
- **Native UI:** Built and deployed to iOS App Store & Google Play
- **CI/CD:**
  - Each repo has its own pipeline (GitHub Actions, GitLab CI, etc.)
  - Core package publishing triggers version bump + changelog update
  - UI pipelines pull Core as dependency from registry

## 7. Example Workflow (Login Feature)

1. **Core team:**
   - Implements `authSlice`, `useAuth` hook
   - Publishes `@company/core@1.2.0`
2. **Web UI team:**
   - Builds `<LoginForm>` using `useAuth`
   - Deploys to staging web
3. **Native UI team:**
   - Builds `<LoginScreen>` using `useAuth`
   - Tests on Android/iOS emulator

> Both UIs now use the same logic, different rendering.

## 8. Documentation & Knowledge Sharing

- Core repo must maintain API docs (JSDoc, Typedoc, or Markdown)
- Web & Native repos must maintain component catalogs (Storybook, Expo Snack)
- Regular cross-team syncs (weekly/biweekly) to discuss API changes and design updates

## Summary

This guideline enforces:

- Core team = business logic & state
- Web UI team = browser rendering
- Native UI team = mobile rendering
- Clear versioning, testing, and collaboration workflows
