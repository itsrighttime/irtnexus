You are generating a Node.js Service module for an API following our company’s architecture.
The service should implement business logic, handle transactions if needed, call database queries, and return structured results to the controller.

1. **Purpose**:
   - Encapsulate business logic for a specific API/endpoint.
   - Interact with queries (database) and perform validations or transformations.
   - Return results in a format consumable by the controller.

2. **Imports**:
   - Queries module from `#queries` (placeholder: specify query file)
   - `executeAction` from `#utils` for logging, audit, and observability
   - `RESPONSE` and `logger` from `#utils`

3. **Service rules**:
   - Export async functions for each API endpoint `(req, payload) => Promise<object>`
   - Accept `payload` (validated data from controller) and optionally `conn` for transactions
   - Use `executeAction` to wrap all business logic for audit/logging
   - Call the appropriate query function(s) from `#queries` with `payload` and `conn`
   - Transform query results if needed before returning
   - Return structured result objects like `{ status, code, message, data, uniqueCode }`
   - Catch and propagate errors properly; the controller handles sending responses

4. **Query calling convention**:
   - Queries must always have **two arguments**: `(payload, conn)`
   - Example: `const user = await createUserQuery(payload, conn);`

5. **Response structure**:
   - Always return a structured object compatible with `RESPONSE.send`
   - Example:
     ```javascript
     return RESPONSE.struct(
       RESPONSE.status.SUCCESS,
       HTTP_STATUS.x2_OK,
       "User created successfully",
       "USR001",
       { id: user.id, username: user.username },
     );
     ```

6. **Placeholders for prompt engineer**:
   - `<SERVICE_NAME>`: Service module/file name
   - `<API_NAME>`: Name of the API/endpoint
   - `<QUERY_FUNCTION>`: Name of the query to call
   - `<BUSINESS_LOGIC>`: Any extra data transformation, validation, or calculations
   - `<ADDITIONAL_DETAILS>`: Optional features like multiple queries, transactions, or conditional logic

7. **Example service function**:

        ```javascript
        import { <QUERY_FUNCTION> } from "#queries";
        import { executeAction, RESPONSE, HTTP_STATUS, logger } from "#utils";
        
        export const <API_NAME> = async (req, payload, conn = null) => {
          return executeAction({
            req,
            action: { name: "<API_NAME>", type: "service" },
            resource: { type: "<RESOURCE_TYPE>", id: payload.id || null },
            handler: async (ctx) => {
              // Call the query
              const result = await <QUERY_FUNCTION>(payload, conn);
        
              // Optional: transform or add business logic
              const transformed = {
                id: result.id,
                ...result,
                // <BUSINESS_LOGIC>
              };
        
              // Return structured response
              return RESPONSE.struct(
                RESPONSE.status.SUCCESS,
                HTTP_STATUS.x2_OK,
                "<SUCCESS_MESSAGE>",
                "<UNIQUE_CODE>",
                transformed
              );
            }
          });
        };
        ```

8. **Service function generation instructions**:
   - Wrap all business logic in `executeAction` for audit/logging
   - Accept `payload` and `conn` for database transactions
   - Call queries with `(payload, conn)`
   - Return structured response objects compatible with `RESPONSE.send`
   - Avoid sending HTTP responses directly here — only return data to the controller

9. **Error handling**:
   - Let `executeAction` handle logging and audit
   - Throw errors when business or query fails; controller handles sending the response
