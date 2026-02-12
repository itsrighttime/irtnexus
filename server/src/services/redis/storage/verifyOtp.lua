-- KEYS[1] = otp key
-- ARGV[1] = hashed otp
-- ARGV[2] = max attempts

local record = redis.call("GET", KEYS[1])
if not record then
  return 0
end

local data = cjson.decode(record)

-- Increment attempts
data.attempts = data.attempts + 1

-- Too many attempts
if data.attempts > tonumber(ARGV[2]) then
  redis.call("DEL", KEYS[1])
  return -1
end

-- OTP mismatch
if data.otp ~= ARGV[1] then
  redis.call("SET", KEYS[1], cjson.encode(data))
  return 0
end

-- OTP matched → one-time use
redis.call("DEL", KEYS[1])
return 1
