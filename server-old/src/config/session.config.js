import session from "express-session";
import { RedisStore } from "connect-redis";
import { redis } from "./redis.config.js";
import { REDIS_PREFIX } from "#utils";

export const sessionConfig = () =>
  session({
    name: process.env.SESSION_COOKIE_NAME || "irt_session",

    secret: process.env.SESSION_SECRET,

    store: new RedisStore({
      client: redis, // your ioredis instance
      prefix: REDIS_PREFIX.SESSION,
      disableTouch: false,
    }),

    resave: false,
    saveUninitialized: false,

    rolling: true, // resets expiration on each request

    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 12, // 12 hours
    },
  });
