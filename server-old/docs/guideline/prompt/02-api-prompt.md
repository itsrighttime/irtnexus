## **AI Prompt: Generate Backend Code in Existing Project Standards (Enhanced)**

### **Instructions for AI**

You are a Node.js backend developer. All code must **reuse existing project utilities, constants, and structures**. **Do not invent new modules, response formats, or logging mechanisms.**

All APIs follow a **uniform structure**: Controller → Validation → Service → DB → Response & Logging → Audit.

---

### **1. Predefined Modules and Utilities (Always Use)**

| Module                             | Purpose                          | Notes / Example                                                           |
| ---------------------------------- | -------------------------------- | ------------------------------------------------------------------------- |
| `UtilsValidator` + `VALIDATOR_KEY` | Validate request payloads        | e.g., `[KEY.required, KEY.string, [KEY.matches, regEx.lettersAndSpaces]]` |
| `graphService`                     | Service layer for business logic | Always wrap logic inside `executeAction`                                  |
| `RESPONSE`                         | Standardized API response        | Use `RESPONSE.send` for success/info, `RESPONSE.error` for errors         |
| `logger`                           | Logging wrapper                  | `logger.info/warn/error/debug/verbose`                                    |
| `generateBinaryUUID()`             | Generate BINARY(16) UUID for DB  | Always use for new IDs                                                    |
| `entityQuery`                      | DB queries for entities          | e.g., `insertEntity({ id, name, type, metadata, status })`                |
| `HTTP_STATUS`                      | Standard HTTP status codes       | e.g., `HTTP_STATUS.x2_OK`, `HTTP_STATUS.x4_BAD_REQUEST`                   |
| `executeAction`                    | Wrap business logic              | Handles audit logging, duration, error handling                           |
| `VALIDATOR_KEY`                    | Supported validation rules       | See section 3                                                             |

---

### **Project Standards**

1. **Express-based API**: All routes use `express.Router()` and controllers.
2. **Controllers**:
   - Controller functions are async.
   - Validation is done using `UtilsValidator` and `VALIDATOR_KEY`.
   - Responses are sent via the centralized `RESPONSE.send` or `RESPONSE.error`.

3. **Services**:
   - All business logic lives in services (e.g., `graphService`).
   - Services always use `executeAction` for logging, audit, and observability.

4. **Database**:
   - Use prepared statements via `DatabaseFactory`.
   - UUIDs are always stored as `BINARY(16)` using `generateBinaryUUID` or `hexToBinary`.

5. **Logging**:
   - Use `logger` for info/debug/error/verbose.
   - All actions must have an `auditId` and be logged via `observability.logAuditEvent`.

6. **Response Structure**:
   - Always return a JSON object using `RESPONSE.struct` or `RESPONSE.send`.
   - Include: `status`, `code`, `message`, `uniqueCode`, `data`, `meta` with `requestId` and `auditId`.

7. **Validation**:
   - Always validate input using `UtilsValidator.validatePayload` with `VALIDATOR_KEY`.
   - Return a `0001E` code for validation errors.

8. **Error Handling**:
   - All unexpected errors must be caught and logged.
   - Return `RESPONSE.error` with a unique code like `0001F`.

---

### **Expected File Structure**

1. **Routes**:
   - `/routes/entityRoute.js`
   - Example:

     ```js
     router.post("/", entityController.createEntity);
     router.patch("/", entityController.updateEntity);
     ```

2. **Controllers**:
   - `/controllers/entityController.js`
   - Must handle request validation and call service functions.

3. **Services**:
   - `/services/graphService.js`
   - Business logic wrapped inside `executeAction`.

4. **Database Queries**:
   - `/queries/entityQuery.js`
   - Should include insert/update/select queries.

5. **Utilities**:
   - Logging (`logger.js`), Response (`sendResponse.js`), UUID (`uuid.js`), Validation (`validator.js`).

---

### **2. Supported Validation Keys (`VALIDATOR_KEY`)**

Use these keys when defining validation schema:

```js
const KEY = VALIDATOR_KEY;

(trim,
  required,
  string,
  number,
  boolean,
  email,
  phone,
  password,
  username,
  safe,
  slug,
  uuid,
  url,
  minLength,
  maxLength,
  range,
  matches,
  oneOf,
  notOneOf,
  date,
  json,
  base64,
  transform,
  sanitize,
  customAsync);
```

**Example:** Validate entity creation payload:

```js
const schema = {
  name: [KEY.required, KEY.string, [KEY.matches, /^[A-Za-z ]+$/], KEY.safe],
  type: [KEY.required, [KEY.oneOf, graphService.getEntityTypes()]],
  metadata: [KEY.json],
};
```

---

### **3. Generic Layer Structure for Any API**

Every API follows **these layers and steps**:

#### **A. Controller Layer**

1. Validate `req.body` (or `req.query`) using `UtilsValidator` and `VALIDATOR_KEY`.
2. If validation fails, return `RESPONSE.send` with **error code `"0001E"`**.
3. Call the corresponding **service function**, passing `req` and validated payload.
4. Catch unexpected errors → `RESPONSE.error` with code `"0001F"`.
5. Use `logger.error` for unexpected exceptions.

**Generic Example:**

```js
export const <functionName> = async (req, res) => {
  try {
    const validate = await validate<FunctionName>.schema(req.body);
    if (!validate.valid) {
      return RESPONSE.send(
        req,
        res,
        RESPONSE.struct(RESPONSE.status.ERROR, HTTP_STATUS.x4_BAD_REQUEST, "Validation Failed", "0001E", validate)
      );
    }

    const payload = validate.value;
    const result = await graphService.<functionName>(req, payload);
    return RESPONSE.send(req, res, result);
  } catch (err) {
    logger.error(err);
    return RESPONSE.error(req, res, err.message, "0001F");
  }
};
```

---

#### **B. Service Layer**

1. Wrap business logic inside `executeAction` for audit, duration, and logging.
2. Generate UUIDs via `generateBinaryUUID()` if new entities are created.
3. Insert/update DB via `entityQuery`.
4. Return **structured response** using `RESPONSE.struct`:

```js
export const <functionName> = async (req, payload) =>
  executeAction({
    req,
    action: { name: ACTION.NAME.<FUNCTION>, type: ACTION.TYPE.<CATEGORY> },
    resource: {},
    handler: async () => {
      const id = generateBinaryUUID();
      await entityQuery.<insert/update method>({ id, ...payload, status: "active" });
      return RESPONSE.struct(RESPONSE.status.SUCCESS, HTTP_STATUS.x2_OK, "<Message>", "<UniqueCode>", { id });
    },
  });
```

---

#### **C. Validation Layer**

- Use `VALIDATOR_KEY` for all validation rules.
- Example:

```js
const schema = {
  name: [KEY.required, KEY.string, [KEY.matches, /^[A-Za-z ]+$/], KEY.safe],
  type: [KEY.required, [KEY.oneOf, graphService.getEntityTypes()]],
  metadata: [KEY.json],
};
export const validate<FunctionName> = UtilsValidator.compile(schema);
```

---

#### **D. DB Layer**

- Always reuse `entityQuery` functions.
- Use `generateBinaryUUID()` or `hexToBinary()` for IDs.
- Example insert:

```js
await entityQuery.insertEntity({
  id: generateBinaryUUID(),
  name,
  type,
  metadata,
  status: "active",
});
```

---

#### **E. Logging & Audit**

- `executeAction` automatically handles:
  - `logger.verbose` operational logs
  - Immutable audit logging
  - Duration measurement
  - `auditId` generation

- Additional logging in controller for errors only.

---

#### **F. Response Structure**

```js
{
  status: "success" | "error" | "info",
  code: HTTP_STATUS.x2_OK | ...,
  message: "Descriptive message",
  uniqueCode: RESPONSE.getUniqueCode("<CODE>", status),
  data: {...} | null,
  meta: {
    requestId: ctx.requestId,
    auditId: ctx.auditId
  }
}
```

---

### **4. Example Full API (Create Entity)**

Perfect! Let’s create a **full example API** end-to-end, reusing all your predefined utilities, constants, validation keys, and layers. We’ll make a **“Create Entity” API** as a concrete example.

---

## **1. Validation Layer**

```js
import { UtilsValidator } from "#utils/validator";
import { VALIDATOR_KEY as KEY } from "#utils/constants";
import { graphService } from "#services";

// Validation schema for creating an entity
const createEntitySchema = {
  name: [KEY.required, KEY.string, [KEY.matches, /^[A-Za-z ]+$/], KEY.safe],
  type: [KEY.required, [KEY.oneOf, graphService.getEntityTypes()]],
  metadata: [KEY.json],
};

export const validateEntity = {
  createEntity: UtilsValidator.compile(createEntitySchema),
};
```

---

## **2. DB Layer (Queries)**

```js
import { generateBinaryUUID } from "#utils/uuid";

/**
 * Entity queries
 * Each function takes:
 *   @param {Object} payload - The data for the query
 *   @param {Object} conn - Database connection (for transactions)
 */
export const entityQuery = {
  insertEntity: async (payload, conn) => {
    const { id, name, type, metadata, status } = payload;
    const sql = `
      INSERT INTO entities (id, name, type, metadata, status)
      VALUES (?, ?, ?, ?, ?)
    `;
    const params = [id, name, type, JSON.stringify(metadata || {}), status];
    await conn.execute(sql, params);
  },

  updateEntity: async (payload, conn) => {
    const { id, name, type, metadata, status } = payload;
    const sql = `
      UPDATE entities
      SET name = ?, type = ?, metadata = ?, status = ?
      WHERE id = ?
    `;
    const params = [name, type, JSON.stringify(metadata || {}), status, id];
    await conn.execute(sql, params);
  },

  getEntityById: async (payload, conn) => {
    const { id } = payload;
    const sql = `SELECT * FROM entities WHERE id = ?`;
    const [rows] = await conn.execute(sql, [id]);
    return rows[0] || null;
  },
};
```

---

## **3. Service Layer**

```js
import { executeAction } from "#utils/executeAction";
import { RESPONSE } from "#utils/sendResponse";
import { entityQuery } from "#queries/entityQuery";
import { generateBinaryUUID } from "#utils/uuid";
import { HTTP_STATUS } from "#utils/statusCode";
import { ACTION } from "#constants/actions";

/**
 * Create a new entity
 */
export const createEntity = async (req, payload) =>
  executeAction({
    req,
    action: { name: ACTION.NAME.ENTITY_CREATION, type: ACTION.TYPE.ENTITY },
    resource: {},
    handler: async () => {
      const id = generateBinaryUUID();
      await entityQuery.insertEntity({
        id,
        name: payload.name,
        type: payload.type,
        metadata: payload.metadata,
        status: "active",
      });

      return RESPONSE.struct(
        RESPONSE.status.SUCCESS,
        HTTP_STATUS.x2_OK,
        "Entity created successfully",
        "00020",
        { id },
      );
    },
  });
```

---

## **4. Controller Layer**

```js
import { RESPONSE } from "#utils/sendResponse";
import { HTTP_STATUS } from "#utils/statusCode";
import { validateEntity } from "#validators/entityValidator";
import { createEntity as createEntityService } from "#services/entityService";
import { logger } from "#utils/logger";

/**
 * Controller: Create Entity
 */
export const createEntity = async (req, res) => {
  try {
    // 1. Validate input
    const validate = await validateEntity.createEntity(req.body);
    if (!validate.valid) {
      return RESPONSE.send(
        req,
        res,
        RESPONSE.struct(
          RESPONSE.status.ERROR,
          HTTP_STATUS.x4_BAD_REQUEST,
          "Validation Failed",
          "0001E",
          validate,
        ),
      );
    }

    const payload = validate.value;

    // 2. Call Service
    const result = await createEntityService(req, payload);

    // 3. Send Success Response
    return RESPONSE.send(req, res, result);
  } catch (err) {
    // 4. Unexpected errors
    logger.error(err);
    return RESPONSE.error(req, res, err.message, "0001F");
  }
};
```

---

### **Key Notes**

1. **Validation**
   - Uses `VALIDATOR_KEY` for all fields.
   - Returns structured validation error if payload is invalid.

2. **Service**
   - Uses `executeAction` to handle audit, logging, duration, error propagation.
   - Uses `generateBinaryUUID()` for new entity ID.
   - Returns **structured response** using `RESPONSE.struct`.

3. **Controller**
   - Handles validation, calls service, sends response.
   - Logs unexpected errors only.

4. **DB**
   - Reuses `entityQuery` methods.
   - Converts JSON objects to string for storage in DB.

5. **Response**
   - Always structured: `{ status, code, message, uniqueCode, data, meta }`
   - `meta` includes `requestId` and `auditId`.

---

**AI Task Summary**

- Generate **controller + service + query + validation** using the steps above.
- **Always reuse existing modules/utilities**.
- **Validation must use VALIDATOR_KEY**.
- **All responses must use RESPONSE struct**.
- **All services wrapped in executeAction**.
- **Generate UUIDs using generateBinaryUUID()**.
- **Do not invent new DB functions, response formats, or logging utilities**.
