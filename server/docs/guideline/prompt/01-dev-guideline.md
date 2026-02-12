# **Backend API Development Guidelines**

## **1. Project Structure**

All backend APIs follow a structured folder hierarchy under `src/`:

```
src/
│
├─ config/         # Configuration files
├─ controllers/    # Handles request & response (one function per file)
│   └─ user/
├─ core/           # Core logic, system-wide utilities
├─ database/       # Database factories & connection instances
├─ middlewares/    # Express middlewares
├─ packages/       # Reusable packages/utilities
├─ queries/        # Database query logic
├─ routes/         # API route definitions
│   ├─ public/     # Public APIs
│   └─ private/    # Protected APIs
├─ services/       # Business logic (service layer)
├─ sessions/       # Session management
├─ swagger/        # API documentation
├─ translations/   # i18n text
├─ utils/          # Helpers & utilities (logging, UUID, response formatting)
└─ validations/    # Validation schemas and payload validators
```

**Naming Conventions:**

- `<entity>.route.js` → routes
- `<entity>.controller.js` → controllers
- `<entity>.service.js` → service layer
- `<entity>.query.js` → database queries

## **2. Routes Layer**

Routes define endpoints and link to controllers.

**Example (`entity.route.js`):**

```js
import express from "express";
import { entityController, entityRelController } from "#controllers";

const router = express.Router();

router.post("/", entityController.createEntity);
router.post("/relationship", entityRelController.addRelationship);
router.patch("/", entityController.updateEntity);

export const entityRoute = router;
```

**Rules:**

1. Separate routes into `public/` and `private/`.
2. Use HTTP methods: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`.
3. Route handler points to **controller function only**.

## **3. Controller Layer**

Controllers handle input validation and send response. They **must follow Single Responsibility Principle**: one file, one function.

**Example (`entity.controller.js`):**

```js
import { graphService } from "#services";
import { HTTP_STATUS, logger, RESPONSE } from "#utils";
import { validateEntity } from "#validations";

export const createEntity = async (req, res) => {
  try {
    // Step 1: Validate payload
    const validate = await validateEntity.createEntity(req.body);
    if (!validate.valid) {
      return RESPONSE.send(
        req,
        res,
        RESPONSE.struct(
          RESPONSE.status.ERROR,
          HTTP_STATUS.x4_BAD_REQUEST,
          "",
          "0001E",
          validate,
        ),
      );
    }

    // Step 2: Extract validated values
    const { name, type, meta } = validate.value;

    // Step 3: Call service layer
    const result = await graphService.createEntity(req, { name, type, meta });

    // Step 4: Send response
    return RESPONSE.send(req, res, result);
  } catch (err) {
    logger.error(err);
    return RESPONSE.error(req, res, err.message, "0001F");
  }
};
```

**Controller Rules:**

- Only manage request & response.
- Validate input → call service → send response.
- Use `RESPONSE.send` for consistent response formatting.

## **4. Validation Layer**

Validates payload using a schema.

**Example (`entity.validation.js`):**

```js
import { UtilsValidator } from "#packages";
import { graphService } from "#services";
import { regEx } from "../regex/index.js";

const { validatePayload, VALIDATOR_KEY: KEY } = UtilsValidator;

export const createEntity = (payload = {}) => {
  const { name, type, meta } = payload;

  const schema = {
    name: [
      KEY.required,
      KEY.string,
      [KEY.matches, regEx.lettersAndSpaces],
      KEY.safe,
    ],
    type: [KEY.required, [KEY.oneOf, graphService.getEnityTypes()]],
    meta: [KEY.json],
  };

  return validatePayload(schema, { name, type, meta });
};
```

**Validation Rules:**

- Use predefined keys & schema to avoid repetitive code.
- All payloads must be validated before calling service layer.

## **5. Service Layer**

Handles core business logic.

**Example (`entity.service.js`):**

```js
import { entityQuery } from "#queries";
import { translate, generateBinaryUUID, RESPONSE, executeAction } from "#utils";
import { ACTION } from "#config";

export const createEntity = async (req, payload) =>
  executeAction({
    req,
    action: { name: ACTION.NAME.ENTITY_CREATION, type: ACTION.TYPE.ENTITY },
    resource: {},
    handler: async () => {
      const { name, type, meta } = payload;
      const id = generateBinaryUUID();
      await entityQuery.insertEntity({ id, name, type, metadata: meta });
      return RESPONSE.struct(
        RESPONSE.status.SUCCESS,
        200,
        translate("entity.entity_created", { entity: name }),
        "00020",
        {},
      );
    },
  });
```

**Rules:**

- Core logic goes **only** in handler of `executeAction`.
- Interact with database through `queries/`.
- Use helpers like `generateBinaryUUID`, `RESPONSE.struct`.

## **6. Queries Layer**

Encapsulates database operations.

**Example (`entity.query.js`):**

```js
import { DatabaseFactory } from "#database";
import { logger } from "#utils";

const opDb = DatabaseFactory.userOp();

export async function insertEntity(
  { id, name, type, metadata, status },
  conn = null,
) {
  const db = conn ?? opDb;
  try {
    await db.query(
      "INSERT INTO entities (id, name, type, metadata, status) VALUES (?, ?, ?, ?, ?)",
      [id, name, type, JSON.stringify(metadata), status],
    );
    logger.info("Inserted entity", { id, name, type, status });
  } catch (error) {
    logger.error({
      message: "Failed to insert entity",
      context: { id, name, type, status },
      error,
    });
    throw error;
  }
}
```

**Rules:**

- Always use database factory for connections.
- Queries accept `payload` and optional `conn` for transactions.
- Use helper functions like `extractRows` if needed.

## **7. Utilities Layer**

Common helpers for all layers.

**Examples:**

- **Logger (`logger.js`)**: Info, error, debug, verbose logs
- **Response (`sendResponse.js`)**: Standardized API response
- **ExecuteAction (`executeAction.js`)**: Wraps business logic with logging, audit, and observability

**Key Rules:**

- Use `logger` at every layer.
- Use `RESPONSE.send` to maintain consistent responses.
- Use `executeAction` in service layer for all business logic.

**Summary Workflow for API Development**

1. **Route** → define endpoint in `routes/`.
2. **Controller** → validate input, call service, send response.
3. **Validation** → define payload schema.
4. **Service** → core business logic in `executeAction.handler`.
5. **Query** → database interaction in `queries/`.
6. **Utils** → use helpers (`logger`, `UUID`, `RESPONSE`) everywhere.
