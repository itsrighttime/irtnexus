# OTP Manager – Usage Guide

`OtpManager` is a lightweight service for generating and verifying **One-Time Passwords (OTPs)**.
It provides a secure and consistent workflow for authentication flows such as:

- User registration
- Login verification
- Email or phone verification
- Password reset

The manager handles:

- OTP creation
- Expiration (TTL)
- Resend cooldown
- Maximum verification attempts
- Secure storage abstraction

# 1. Installation / Setup

Create an instance of `OtpManager` and provide a compatible storage adapter.

```ts
import { OtpManager } from "./otp-manager";

export const otpManager = new OtpManager({
  store: new RedisManager("otp:v1:"),
  ttl: otpMeta.ttl,
  resendCooldown: otpMeta.resendCooldown,
  maxAttempts: otpMeta.maxAttempts,
});
```

### Configuration Options

| Option           | Type       | Description                                             |
| ---------------- | ---------- | ------------------------------------------------------- |
| `store`          | `OtpStore` | Storage implementation used to persist OTP records      |
| `ttl`            | `number`   | OTP expiration time (seconds)                           |
| `resendCooldown` | `number`   | Minimum time required before a new OTP can be requested |
| `maxAttempts`    | `number`   | Maximum allowed verification attempts                   |

Example:

```ts
const otpManager = new OtpManager({
  store: redisStore,
  ttl: 300,
  resendCooldown: 60,
  maxAttempts: 5,
});
```

# 2. Creating an OTP

Use the `create` method to generate or resend an OTP.

```ts
const result = await otpManager.create("user@email.com");
```

### Parameters

| Parameter    | Type                      | Description                                    |
| ------------ | ------------------------- | ---------------------------------------------- |
| `identifier` | `string`                  | Unique identifier (email, phone, userId, etc.) |
| `meta`       | `Record<string, unknown>` | Optional metadata stored alongside the OTP     |

Example:

```ts
const result = await otpManager.create("user@email.com", {
  purpose: "registration",
});
```

### Response

```ts
interface OtpCreateResult {
  success: boolean;
  otp?: string;
  message?: string;
}
```

Example:

```ts
{
  success: true,
  otp: "482193"
}
```

### When Cooldown is Active

```ts
{
  success: false,
  message: "Cooldown is active, OTP already sent. Please wait before requesting again."
}
```

### Sending the OTP

After creation, send the OTP using your preferred service:

```ts
if (result.success) {
  await sendEmailOtp(user.email, result.otp);
}
```

# 3. Verifying an OTP

Use the `verify` method to validate an OTP provided by a user.

```ts
const verification = await otpManager.verify("user@email.com", "482193");
```

### Parameters

| Parameter    | Type     | Description                                  |
| ------------ | -------- | -------------------------------------------- |
| `identifier` | `string` | The same identifier used during OTP creation |
| `otp`        | `string` | OTP entered by the user                      |

### Response

```ts
interface OtpVerifyResult {
  success: boolean;
  type?: number;
  message: string;
}
```

### Successful Verification

```ts
{
  success: true,
  message: "OTP validated successfully."
}
```

### Invalid OTP

```ts
{
  success: false,
  type: 2,
  message: "Invalid OTP. Please check and re-enter."
}
```

### Maximum Attempts Reached

```ts
{
  success: false,
  type: 1,
  message: "OTP locked due to too many attempts."
}
```

# 4. Typical Authentication Flow

A common OTP workflow looks like this:

### Step 1 — User Requests OTP

```ts
const result = await otpManager.create(user.email);

if (!result.success) {
  throw new Error(result.message);
}

await sendEmailOtp(user.email, result.otp);
```

### Step 2 — User Submits OTP

```ts
const verification = await otpManager.verify(user.email, inputOtp);

if (!verification.success) {
  throw new Error(verification.message);
}
```

### Step 3 — Continue Authentication

```ts
// OTP validated
createUserSession(user);
```

# 5. Identifier Strategy

The `identifier` should uniquely represent the verification target.

Examples:

| Use Case           | Identifier Example     |
| ------------------ | ---------------------- |
| Email verification | `user@email.com`       |
| Phone verification | `+919876543210`        |
| Password reset     | `reset:user@email.com` |
| Login OTP          | `login:user@email.com` |

Using prefixes helps isolate OTP scopes.

Example:

```ts
otpManager.create(`register:${email}`);
otpManager.create(`login:${email}`);
```

# 6. Metadata Usage

Optional metadata can be attached to the OTP record.

Example:

```ts
await otpManager.create(email, {
  ip: request.ip,
  device: request.headers["user-agent"],
  purpose: "signup",
});
```

Metadata can be useful for:

- auditing
- fraud detection
- logging
- debugging

# 7. Best Practices

### 1. Keep OTP TTL Short

Recommended:

```
2–5 minutes
```

Example:

```ts
ttl: 300;
```

### 2. Limit Resend Frequency

Example:

```
resendCooldown: 60
```

This prevents OTP spam.

### 3. Restrict Attempts

Example:

```
maxAttempts: 5
```

Helps protect against brute-force attacks.

### 4. Never Log OTPs in Production

Only log metadata or status responses.

### 5. Always Send OTP via Secure Channels

Examples:

- Email
- SMS
- Push notification

# 8. Example Express Route

### Request OTP

```ts
app.post("/auth/request-otp", async (req, res) => {
  const { email } = req.body;

  const result = await otpManager.create(email);

  if (!result.success) {
    return res.status(400).json(result);
  }

  await sendEmailOtp(email, result.otp);

  res.json({ success: true });
});
```

### Verify OTP

```ts
app.post("/auth/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  const result = await otpManager.verify(email, otp);

  if (!result.success) {
    return res.status(400).json(result);
  }

  res.json({ success: true });
});
```

# 9. Storage Requirement

The manager requires a storage adapter implementing:

```ts
OtpStore;
```

This allows integration with:

- Redis
- Database
- In-memory cache
- Distributed cache systems
