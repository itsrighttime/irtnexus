You are generating a Node.js validation schema for an API following our company’s architecture. 
The validation schema should ensure the controller receives correct and sanitized data before calling the service layer.

1. **Purpose**:
   - Validate incoming request payloads (body, params, query, headers)
   - Ensure correct types, required fields, formats, and business rules
   - Transform or sanitize data if needed
   - Return structured validation errors for the controller if validation fails

2. **Imports**:
   - `VALIDATOR_KEY` from `#utils/validatorKeys` (aliased as `KEY`)
   - Any helper functions or constants (e.g., regex patterns, dynamic lists)

3. **Validation rules**:
   - Each field is an array of rules
   - Rules are either:
     - **Direct keys** from `VALIDATOR_KEY` (e.g., `KEY.required`, `KEY.string`)  
     - **Arrays for parameters**, e.g., `[KEY.matches, regEx.lettersAndSpaces]`, `[KEY.oneOf, graphService.getEntityTypes()]`  
   - Supported keys include:

        ```md

        trim, required, string, number, boolean, email, phone, password, username,
        safe, slug, uuid, url, minLength, maxLength, range, matches, oneOf, notOneOf,
        date, json, base64, transform, sanitize, customAsync

        ````
   - Use `[KEY.customAsync, function]` for async or business-specific validation
   - Optional: include sanitization and transformation rules (`KEY.trim`, `KEY.sanitize`, `KEY.transform`)

4. **Schema structure**:
    ```javascript
    export const <SCHEMA_NAME> = {
      fieldName1: [
        KEY.required,
        KEY.string,
        [KEY.matches, <regex_or_function>],
        KEY.safe
      ],
      fieldName2: [
        KEY.number,
        [KEY.range, [1, 100]],
      ],
      fieldName3: [
        KEY.json
      ],
    };
    ````

5. **Placeholders for prompt engineer**:

   * `<SCHEMA_NAME>`: Name of the schema (e.g., `createUserSchema`)
   * `<regex_or_function>`: Regex or dynamic value to validate field
   * Optional: additional rules or async validators

6. **Example: Body validation for creating an entity**

    ```javascript
    export const createEntitySchema = {
      name: [
        KEY.required,
        KEY.string,
        [KEY.matches, regEx.lettersAndSpaces],
        KEY.safe
      ],
      type: [
        KEY.required,
        [KEY.oneOf, graphService.getEntityTypes()]
      ],
      meta: [
        KEY.json
      ],
    };
    ```

7. **Example: Query or Params validation**

    ```javascript
    export const getEntitySchema = {
      entityId: [
        KEY.required,
        KEY.uuid
      ],
    };
    ```

8. **Validation generation instructions**:

   * Map each field to the correct array of rules
   * Include required fields and types first
   * Add optional sanitization/transform rules
   * Use `customAsync` for business-specific validations
   * Schema must be **modular**, so controller can pick the needed schema

