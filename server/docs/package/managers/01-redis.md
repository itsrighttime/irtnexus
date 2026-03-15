# RedisManager Developer Guide

`RedisManager` is a **generic Redis adapter** designed to standardize Redis access across the codebase. It supports:

- Namespaced keys
- JSON serialization
- TTL management
- Atomic operations using Lua
- Counters and rate limiting
- Type-safe storage via TypeScript generics

It acts as the **single Redis abstraction layer** for services such as OTP, reservations, sessions, rate limiting, and caching.

# 1. Installation / Requirements

The manager expects a configured Redis client


# 2. Creating a RedisManager Instance

Always create an instance with a **namespace prefix** to avoid key collisions.

```ts
const userCache = new RedisManager<User>("user:v1:");
```

### Why namespaces?

They isolate data by feature or version.

Example Redis keys:

```
user:v1:123
otp:v1:user@email.com
reserve:v1:username:john
```

# 3. Using Type Safety

`RedisManager` is generic.

```ts
type User = {
  id: string;
  name: string;
  email: string;
};

const userStore = new RedisManager<User>("user:v1:");
```

Now TypeScript will enforce correct types.

# 4. Basic Operations

## Set Value

Stores JSON data in Redis.

```ts
await userStore.set("123", {
  id: "123",
  name: "John",
  email: "john@email.com",
});
```

### With TTL

TTL is in **seconds**.

```ts
await userStore.set("123", userData, 300);
```

Expires after **5 minutes**.

## Get Value

```ts
const user = await userStore.get("123");

if (user) {
  console.log(user.name);
}
```

Return type:

```
T | null
```

## Delete Value

```ts
await userStore.delete("123");
```

# 5. Atomic Operations

Atomic operations ensure **race-condition safe operations** using Redis Lua scripts.

# 5.1 Atomic OTP Verification

Used for **secure OTP validation**.

```ts
const result = await redisManager.verifyAtomic("user@email.com", hashedOtp, 5);
```

### Return values

| Code | Meaning               |
| ---- | --------------------- |
| 1    | OTP verified          |
| 0    | Invalid OTP           |
| -1   | Max attempts exceeded |

### Example usage

```ts
if (result === 1) {
  console.log("OTP verified");
}

if (result === -1) {
  console.log("Too many attempts");
}
```

# 5.2 Atomic Resource Reservation

Used when multiple resources must be **reserved simultaneously**.

Example:

- email
- username
- reservation token

```ts
const success = await redisManager.reserveAtomic(
  ["email:user@email.com", "username:john", "token:abc123"],
  {
    email: "user@email.com",
    username: "john",
  },
  300,
);
```

### Behavior

1. If **any key exists → reservation fails**
2. If **all keys free → reserve all**

Return:

```
true → reserved
false → conflict
```

# 6. Counter / Rate Limiting

Used for **login throttling, API limits, or analytics counters**.

```ts
const attempts = await redisManager.increment("login:user@email.com", 60);
```

Behavior:

- Increments the counter
- Optional TTL resets counter window

Example:

```
attempt 1
attempt 2
attempt 3
```

# 7. Checking Key Existence

```ts
const exists = await redisManager.exists("user:123");

if (exists) {
  console.log("User cached");
}
```

# 8. Key Namespacing Strategy

Recommended naming format:

```
<service>:<version>:<resource>:<identifier>
```

Example:

```
otp:v1:register:user@email.com
reserve:v1:username:john
session:v1:token:abc123
rate:v1:login:user@email.com
```

Benefits:

- Prevents collisions
- Enables version upgrades
- Simplifies debugging

# 9. TTL Guidelines

Always use TTL for **temporary data**.

Recommended TTLs:

| Use Case    | TTL       |
| ----------- | --------- |
| OTP         | 5 minutes |
| Reservation | 5 minutes |
| Rate Limit  | 1 minute  |
| Session     | 24 hours  |

# 10. Recommended Usage Pattern

Instead of using `RedisManager` directly in controllers, wrap it inside **domain managers**.

Example:

```
OtpManager
ReservationManager
SessionManager
CacheManager
```

Example:

```ts
const otpStore = new RedisManager<OtpRecord>("otp:v1:");
const reservationStore = new RedisManager<Reservation>("reserve:v1:");
```

This ensures Redis logic stays **centralized and maintainable**.

# 11. Error Handling Best Practices

Always guard against null values.

```ts
const data = await store.get("key");

if (!data) {
  throw new Error("Data not found");
}
```

# 12. Performance Notes

Redis operations used here are **O(1)**.

Atomic scripts avoid:

- race conditions
- partial writes
- inconsistent states

# 13. Debugging Keys

View keys in Redis CLI:

```
KEYS otp:v1:*
```

Or:

```
SCAN 0 MATCH otp:v1:*
```

# 14. Example Full Flow

Example: Registration reservation

```ts
const store = new RedisManager<Reservation>("reserve:v1:");

const ok = await store.reserveAtomic(
  ["email:test@email.com", "username:test", "token:abc123"],
  {
    email: "test@email.com",
    username: "test",
  },
  300,
);
```

# 15. Best Practices

Always:

- Use namespaces
- Set TTL for temporary data
- Use atomic operations for concurrency
- Use TypeScript generics
- Avoid direct Redis usage outside this manager

# Summary

`RedisManager` provides a **safe, consistent Redis abstraction** supporting:

- typed storage
- namespaced keys
- atomic operations
- rate limiting counters
- TTL management

It should be used as the **foundation layer for Redis interactions across the application**.
