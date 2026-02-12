# Developer Onboarding Playbook

## Purpose

The purpose of this playbook is to **streamline the onboarding process** for new developers joining the team.

It ensures that:

- Developers understand the **system architecture and coding standards**
- They can **quickly contribute** to the codebase
- They follow the **guidelines and best practices**
- Onboarding is **consistent across the team**

## Core Objectives

1. **Understand the Project Structure**
   - Routes, controllers, services, queries, utils, translations, and packages
   - Middleware and request lifecycle
   - Versioning and API documentation

2. **Follow Coding Guidelines**
   - Use guidelines in `/guidelines` folder
   - Ensure consistent code quality

3. **Set Up Local Environment**
   - Install required software and dependencies
   - Configure database and Redis connections
   - Run the project locally

4. **Understand Development Workflow**
   - Branching strategy
   - Pull requests and code review process
   - CI/CD pipeline basics

## Onboarding Steps

### Step 1: Project Setup

1. Clone the repository:

   ```bash
   git clone <repo-url>
   cd <project-folder>
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create environment file from template:

   ```bash
   cp .env.example .env
   ```

   - Update variables such as database, Redis, and API keys

4. Initialize database:
   - Run migrations if applicable
   - Ensure seed data is populated for testing

5. Start the local server:

   ```bash
   npm run dev
   ```

   - Access Swagger docs at `/api-docs` to verify endpoints

### Step 2: Understanding Architecture

- **Request Lifecycle:**
  Middleware → Routes → Controller → Validator → Service → Queries → DB

- **Key Folders:**

  ```
  /routes        -> API route definitions
  /controllers   -> Business logic handlers
  /services      -> Service layer, orchestrating controllers
  /queries       -> Database queries
  /utils         -> Reusable helper functions
  /translations  -> Multi-language support
  /swagger       -> API documentation
  /packages      -> Internal reusable packages
  /validators    -> Input validation schemas
  ```

- **Middlewares:**
  - `languageMiddleware` → set request language
  - `requestContextMiddleware` → request IDs, logging, observability

### Step 3: Coding Standards

- Follow **guidelines in `/guidelines`**:
  - Core principles
  - Request lifecycle
  - Controller & service design
  - Validation, error handling, observability
  - Swagger documentation
  - Versioning and security

- Use **semantic variable names** and proper **JS/Node.js conventions**

- Always **write tests** for new logic

### Step 4: Git Workflow

1. Branching strategy:

   ```
   main      -> production-ready code
   develop   -> integration branch
   feature/* -> new features
   fix/*     -> bug fixes
   ```

2. Pull Request (PR) process:
   - Ensure **code is reviewed** before merging
   - Include **linked Jira/task reference**
   - Run tests locally before submitting PR

### Step 5: Testing & Quality

- **Unit Tests:** Use Jest or preferred framework
- **Integration Tests:** Cover API endpoints
- **Linting:** ESLint/Prettier to maintain code style
- **Observability:** Prometheus metrics for request tracking
- **Logging:** Use structured logging (`logger`) for debugging

### Step 6: Working with Versioned APIs

- Always check **API version** before implementing changes
- Refer to `swaggerSpec` for each version
- Follow **versioning guidelines** for backward compatibility

### Step 7: Deployment Awareness

- Understand CI/CD pipelines and environment configurations
- Know how to run builds and deploy to **staging or dev environments**
- Learn rollback procedures in case of failures

### Step 8: Documentation

- Always document **new endpoints, services, or packages**
- Update **Swagger/OpenAPI JS objects** for API changes
- Update translation files if introducing new user-facing messages

### Step 9: Collaboration & Support

- Use **internal chat channels** for queries
- Follow team practices for **code reviews** and **PR approvals**
- Engage in **knowledge-sharing sessions** to understand complex modules

## Checklist for Onboarding Completion

- [ ] Local development environment set up successfully
- [ ] Able to run server and test endpoints
- [ ] Understand project architecture and folder structure
- [ ] Familiar with coding guidelines and middleware
- [ ] Able to implement a feature following guidelines
- [ ] Unit and integration tests written for new code
- [ ] Swagger docs updated and versioning understood
- [ ] CI/CD pipeline workflow observed

## Summary

Following this playbook ensures that **new developers become productive quickly**, **adhere to system standards**, and **maintain high code quality**.

It should be revisited periodically to include **updates on architecture, guidelines, and best practices**.
