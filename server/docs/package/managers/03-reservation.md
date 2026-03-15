# Reservation Manager – Usage Guide

`ReservationManager` provides a **temporary reservation system** for user identifiers such as emails and usernames.
It is useful for:

- Preventing race conditions during registration
- Temporarily holding resources until a process completes

The manager handles:

- Atomic reservation of multiple keys
- Automatic expiration (TTL)
- Retrieval and consumption of reservations

# 1. Setup

Create an instance of `ReservationManager` with a compatible storage adapter:

```ts
import { ReservationManager } from "./reservation-manager";

export const reservationManager = new ReservationManager({
  store: new RedisManager("reserve:v1:"), // any store implementing ReservationStore
  ttl: reservationTTL, // e.g., 300 seconds
});
```

### Configuration Options

| Option  | Type               | Description                             |
| ------- | ------------------ | --------------------------------------- |
| `store` | `ReservationStore` | Storage adapter to persist reservations |
| `ttl`   | `number`           | Reservation expiration time in seconds  |

# 2. Reserving an Email and Username

Use the `reserve` method to **atomically reserve an email and username**:

```ts
const result = await reservationManager.reserve({
  email: "user@example.com",
  username: "newuser",
});
```

### Parameters

| Parameter  | Type     | Description              |
| ---------- | -------- | ------------------------ |
| `email`    | `string` | Email address to reserve |
| `username` | `string` | Username to reserve      |

### Response

```ts
interface ReservationResult {
  success: boolean;
  token?: string;
}
```

Example:

```ts
{
  success: true,
  token: "c1a2e3f4-5678-90ab-cdef-1234567890ab"
}
```

If the reservation **fails** (e.g., email or username already reserved):

```ts
{
  success: false;
}
```

> The returned `token` uniquely identifies the reservation.

# 3. Retrieving Reservation Details

Use the `get` method with the token:

```ts
const data = await reservationManager.get(
  "c1a2e3f4-5678-90ab-cdef-1234567890ab",
);
```

### Response

```ts
interface ReservationRecord {
  email: string;
  username: string;
}
```

If the token is invalid or expired, `get` returns `null`.

# 4. Consuming a Reservation

Once a reservation is used (e.g., after successful registration), **consume** it to free up resources:

```ts
const ok = await reservationManager.consume(
  "c1a2e3f4-5678-90ab-cdef-1234567890ab",
);
```

- Returns `true` if the reservation existed and was removed
- Returns `false` if the reservation was invalid or already consumed

# 5. Typical Registration Flow

### Step 1 — Reserve Identifiers

```ts
const reservation = await reservationManager.reserve({
  email: req.body.email,
  username: req.body.username,
});

if (!reservation.success) {
  return res.status(400).json({ error: "Email or username already reserved" });
}
```

### Step 2 — Retrieve Reservation Before Use

```ts
const reservedData = await reservationManager.get(reservation.token);

if (!reservedData) {
  return res.status(400).json({ error: "Reservation expired" });
}
```

### Step 3 — Complete Registration and Consume

```ts
await createUser(reservedData.email, reservedData.username);
await reservationManager.consume(reservation.token);
```

# 6. Storage Requirement

`ReservationManager` requires a storage adapter implementing:

```ts
ReservationStore;
```

This allows integration with:

- Redis
- Database
- In-memory cache
- Distributed cache systems

The store must support **atomic reservations** across multiple keys.

# 7. Best Practices

1. **Keep TTL Short** – Typical reservation TTL: 2–5 minutes
2. **Always Consume Reservations** – Prevent stale reservations from blocking resources
3. **Handle Failures Gracefully** – Check `success` before proceeding
4. **Use Tokens as Reference** – Avoid storing email/username separately; rely on token

# 8. Example Express Route

### Reserve

```ts
app.post("/register/reserve", async (req, res) => {
  const { email, username } = req.body;

  const reservation = await reservationManager.reserve({ email, username });

  if (!reservation.success) {
    return res
      .status(400)
      .json({ error: "Email or username already reserved" });
  }

  res.json({ success: true, token: reservation.token });
});
```

### Consume After Registration

```ts
app.post("/register/complete", async (req, res) => {
  const { token } = req.body;

  const reservation = await reservationManager.get(token);

  if (!reservation) {
    return res.status(400).json({ error: "Invalid or expired reservation" });
  }

  await createUser(reservation.email, reservation.username);
  await reservationManager.consume(token);

  res.json({ success: true });
});
```

`ReservationManager` ensures **atomic reservation** of identifiers, preventing race conditions and temporary conflicts in user registration or resource allocation.
