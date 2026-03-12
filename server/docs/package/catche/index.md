# Cache Module – Usage Patterns

The cache module can be used in several ways depending on your application's needs.

Available cache types:

- `InMemoryCache`
- `RedisCache`
- `CompositeCache`

Each supports the same interface and can be used interchangeably.

# 1. Basic In-Memory Cache

Best for:

- small apps
- local caching
- temporary data

### Example

```ts
import { InMemoryCache } from "cache-module";

const cache = new InMemoryCache();

await cache.set("user:1", { id: 1, name: "John" }, 60);

const user = await cache.get("user:1");

console.log(user);
```

# 2. Redis Cache Only

Best for:

- distributed systems
- shared cache across multiple services
- persistence across server restarts

### Example

```ts
import Redis from "ioredis";
import { RedisCache } from "cache-module";

const redis = new Redis();

const cache = new RedisCache(redis);

await cache.set("product:42", { name: "Laptop" }, 300);

const product = await cache.get("product:42");
```

# 3. Multi-Layer Cache (Recommended for Production)

Use **CompositeCache** to combine memory and Redis.

### Example

```ts
import Redis from "ioredis";
import { CompositeCache, InMemoryCache, RedisCache } from "cache-module";

const redis = new Redis();

const cache = new CompositeCache(new InMemoryCache(), new RedisCache(redis));

await cache.set("config", { version: 1 }, 600);

const config = await cache.get("config");
```

# 4. Cache-Aside Pattern

Manually check cache first, then fetch from source.

### Example

```ts
async function getUser(id: string) {
  let user = await cache.get(`user:${id}`);

  if (!user) {
    user = await db.getUser(id);
    await cache.set(`user:${id}`, user, 300);
  }

  return user;
}
```

# 5. Using `wrap()` (Recommended)

`wrap()` simplifies cache-aside logic.

### Example

```ts
const user = await cache.wrap(`user:${id}`, 300, () => db.getUser(id));
```

This automatically:

1. Checks cache
2. Executes fetcher if missing
3. Stores result
4. Returns value

# 6. Caching API Responses

Example inside a service.

```ts
async function getProducts() {
  return cache.wrap("products:list", 120, async () => {
    return productService.fetchProducts();
  });
}
```

# 7. Caching Database Queries

```ts
async function getOrder(orderId: string) {
  return cache.wrap(`order:${orderId}`, 600, () => db.orders.findById(orderId));
}
```

# 8. Checking If Cache Exists

Sometimes you only need to know if the key exists.

```ts
const exists = await cache.has("user:1");

if (exists) {
  console.log("User is cached");
}
```

# 9. Cache Invalidation

Remove outdated data.

```ts
await cache.del(`user:${userId}`);
```

Example after update:

```ts
async function updateUser(userId: string, data: any) {
  await db.updateUser(userId, data);

  await cache.del(`user:${userId}`);
}
```

# 10. Pre-warming Cache

Populate cache ahead of time.

```ts
async function warmCache() {
  const products = await productService.fetchProducts();

  await cache.set("products:list", products, 300);
}
```

# 11. Using Cache in a Service Class

Example dependency injection pattern.

```ts
class ProductService {
  constructor(private cache: CacheClient) {}

  async getProduct(id: string) {
    return this.cache.wrap(`product:${id}`, 300, () =>
      db.products.findById(id),
    );
  }
}
```

# 12. Multiple Cache Instances

Different caches for different purposes.

```ts
const shortCache = new InMemoryCache();
const longCache = new RedisCache(redis);

await shortCache.set("session:1", session, 60);
await longCache.set("product:1", product, 3600);
```

# Summary

Common usage patterns:

| Pattern          | When to Use           |
| ---------------- | --------------------- |
| `get/set`        | simple caching        |
| `wrap()`         | automatic cache-aside |
| `CompositeCache` | production apps       |
| `del()`          | cache invalidation    |
| `has()`          | existence checks      |
| pre-warming      | startup optimization  |
