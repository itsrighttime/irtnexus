import dns from "dns/promises";
import whois from "whois-json";
import { redis } from "#config"; // adjust path as needed
import { REDIS_PREFIX } from "#utils";

const CACHE_PREFIX = REDIS_PREFIX.DOMAIN.VERIFY;
const TTL_REGISTERED = 60 * 60 * 24; // 24h
const TTL_NOT_REGISTERED = 60 * 60 * 6; // 6h
const TTL_TIMEOUT = 60 * 60; // 1h

const withTimeout = (promise, ms = 3000) =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), ms),
    ),
  ]);

const isValidDomainFormat = (domain) => {
  if (!domain || typeof domain !== "string") return false;

  const clean = domain.trim().toLowerCase();

  if (clean.includes("://") || clean.includes("/")) return false;
  if (clean.length > 253) return false;

  const regex = /^(?!-)(?:[a-z0-9-]{1,63}\.)+[a-z]{2,63}$/i;
  return regex.test(clean);
};

export const verifyDomainEnterprise = async (domain) => {
  const clean = domain?.trim().toLowerCase();

  if (!isValidDomainFormat(clean)) {
    return {
      valid: false,
      registered: false,
      reason: "invalid_format",
      source: "validation",
    };
  }

  const cacheKey = `${CACHE_PREFIX}${clean}`;

  // 🔹 1. Check Cache First
  const cached = await redis.get(cacheKey);
  if (cached) {
    return {
      ...JSON.parse(cached),
      source: "cache",
    };
  }

  let result;

  // 🔹 2. DNS A/AAAA
  try {
    const records = await withTimeout(dns.resolve(clean), 2000);
    if (records?.length) {
      result = {
        valid: true,
        registered: true,
        reason: "dns_a_record",
        source: "dns",
      };

      await redis.set(cacheKey, JSON.stringify(result), "EX", TTL_REGISTERED);
      return result;
    }
  } catch {}

  // 🔹 3. DNS NS
  try {
    const nsRecords = await withTimeout(dns.resolveNs(clean), 2000);
    if (nsRecords?.length) {
      result = {
        valid: true,
        registered: true,
        reason: "dns_ns_record",
        source: "dns",
      };

      await redis.set(cacheKey, JSON.stringify(result), "EX", TTL_REGISTERED);
      return result;
    }
  } catch {}

  // 🔹 4. WHOIS fallback
  try {
    const whoisResult = await withTimeout(whois(clean), 4000);

    if (whoisResult?.domainName || whoisResult?.domain) {
      result = {
        valid: true,
        registered: true,
        reason: "whois_confirmed",
        source: "whois",
      };

      await redis.set(cacheKey, JSON.stringify(result), "EX", TTL_REGISTERED);
      return result;
    }
  } catch (err) {
    if (err.message === "timeout") {
      result = {
        valid: true,
        registered: false,
        reason: "whois_timeout",
        source: "whois",
      };

      await redis.set(cacheKey, JSON.stringify(result), "EX", TTL_TIMEOUT);
      return result;
    }
  }

  // 🔹 5. Final failure
  result = {
    valid: true,
    registered: false,
    reason: "not_registered_or_no_dns",
    source: "verification",
  };

  await redis.set(cacheKey, JSON.stringify(result), "EX", TTL_NOT_REGISTERED);

  return result;
};
