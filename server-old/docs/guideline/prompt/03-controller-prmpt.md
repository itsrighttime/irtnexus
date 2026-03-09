You are generating a Node.js Express controller for an API following our company’s architecture. 
The controller should adhere to the following rules:

1. **Purpose**: Handle HTTP requests and responses for a specific resource (like Entity, User, etc.).

2. **Imports**:
   - Service module from `#services` (placeholder: specify service name)
   - Validation module from `#validations` (placeholder: specify validation name)
   - `RESPONSE`, `HTTP_STATUS`, `logger` from `#utils`

3. **Supported HTTP_STATUS**:

```js
export const HTTP_STATUS = {
  x2_OK: 200,
  x2_CREATED: 201,
  x2_ACCEPTED: 202,
  x2_NO_CONTENT: 204,
  x4_BAD_REQUEST: 400,
  x4_UNAUTHORIZED: 401,
  x4_FORBIDDEN: 403,
  x4_NOT_FOUND: 404,
  x4_CONFLICT: 409,
  x4_UNPROCESSABLE_ENTITY: 422,
  x5_INTERNAL_SERVER_ERROR: 500,
  x5_NOT_IMPLEMENTED: 501,
  x5_BAD_GATEWAY: 502,
  x5_SERVICE_UNAVAILABLE: 503,
  x5_GATEWAY_TIMEOUT: 504
};
```

4. **Supported status types**:

const status = {
  SUCCESS: "success",
  ERROR: "error",
  INFO: "info",
  REDIRECT: "redirect",
};

5. **Controller rules**:
   - Export async functions for each API endpoint `(req, res) => Promise<void>`
   - Validate request payload using the predefined validation functions before calling the service
     - Validation function returns `{ valid: boolean, value: object, errors?: object }`
     - If invalid, immediately respond with `RESPONSE.send` with code `0001E`
   - Call the service function corresponding to the endpoint
     - Pass **validated payload only**
     - Catch service errors and respond with `RESPONSE.error` using code `0001F`
   - Log errors with `logger.error`
   - Send responses using `RESPONSE.send` or `RESPONSE.error`
   - Keep controller logic minimal: only validation, service call, and response handling
   - Do **not** include business logic or database queries here

6. **Response examples**:

- **Success**:  
```js
return RESPONSE.send(req, res, resultFromService);
```

* **Validation error**:

```js
const payload = RESPONSE.struct(
  RESPONSE.status.ERROR,
  HTTP_STATUS.x4_BAD_REQUEST,
  "",
  "0001E",
  validateResult
);
return RESPONSE.send(req, res, payload);
```

* **Unexpected error**:

```javascript
return RESPONSE.error(req, res, error.message, "0001F");
```

7. **Placeholders for prompt engineer**:

   * `<API_NAME>`: Name of the API/endpoint
   * `<VALIDATION_FUNCTION>`: Validation function name for request payload
   * `<SERVICE_FUNCTION>`: Service function name to be called
   * `<ADDITIONAL_DETAILS>`: Any extra requirements like auth, query params, or special logging

8. **Example controller**:

```javascript
import { <SERVICE_FUNCTION> } from "#services";
import { RESPONSE, HTTP_STATUS, logger } from "#utils";
import { <VALIDATION_FUNCTION> } from "#validations";

export const <API_NAME> = async (req, res) => {
  try {
    const validate = await <VALIDATION_FUNCTION>(req.body);

    if (!validate.valid) {
      const payload = RESPONSE.struct(
        RESPONSE.status.ERROR,
        HTTP_STATUS.x4_BAD_REQUEST,
        "",
        "0001E",
        validate
      );
      return RESPONSE.send(req, res, payload);
    }

    const result = await <SERVICE_FUNCTION>(req, validate.value);
    return RESPONSE.send(req, res, result);
  } catch (err) {
    logger.error(err);
    return RESPONSE.error(req, res, err.message, "0001F");
  }
};
```

9. **Instructions for generating controller code**:

   * Replace placeholders (`<API_NAME>`, `<VALIDATION_FUNCTION>`, `<SERVICE_FUNCTION>`) with actual API-specific names
   * Follow the above response handling and logging conventions
   * Ensure validation happens **before** service call
   * Ensure all uniqueCodes follow conventions (`0001E` for validation, `0001F` for service/unexpected errors)
   * Keep controller functions **short and clean** with only request validation, service call, and response
