import cors from "cors";

/**
 * List of allowed origins for CORS
 *
 * Only requests coming from these origins will be accepted.
 * Useful for limiting access to trusted front-end clients.
 */
const allowedOrigins = [
  "http://localhost:1060",
  "http://localhost:1061",
  "http://localhost:5173",
  "http://localhost:1062",
];

/**
 * CORS configuration for Express
 *
 * - origin: A function to dynamically check if the incoming request's origin is allowed.
 * - credentials: Allow sending cookies or HTTP authentication information.
 */
export const configCors = cors({
  origin: (origin, callback) => {
    // Handle requests without an Origin header (e.g., mobile apps, Postman)
    if (!origin) {
      // Optional: add additional checks for requests without origin
      // e.g., validate a custom header, user-agent, or authorization token
      //
      // Example:
      // if (req.headers['authorization'] === 'YourToken') {
      //   return callback(null, true);
      // }
      // return callback(new Error("Unauthorized null origin"), false);

      // For now, allow requests without an origin
      return callback(null, true);
    }

    // If the origin is not in the allowed list, reject the request
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }

    // Origin is allowed
    return callback(null, true);
  },

  // Allow cookies and authentication headers to be sent in CORS requests
  credentials: true,
});
