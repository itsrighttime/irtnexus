-- KEYS:
-- 1 = emailKey
-- 2 = usernameKey
-- 3 = tokenKey

-- ARGV:
-- 1 = ttl in ms
-- 2 = payload (json)

if redis.call("EXISTS", KEYS[1]) == 1 then
  return 0
end

if redis.call("EXISTS", KEYS[2]) == 1 then
  return 0
end

redis.call("SET", KEYS[1], KEYS[3], "PX", ARGV[1])
redis.call("SET", KEYS[2], KEYS[3], "PX", ARGV[1])
redis.call("SET", KEYS[3], ARGV[2], "PX", ARGV[1])

return 1
