import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const memoryBuckets = new Map();
let redis;
const remoteLimiters = new Map();

function getRedis() {
  if (process.env.NODE_ENV === "test") return null;

  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    return null;
  }

  redis ||= Redis.fromEnv();
  return redis;
}

export async function enforceRateLimit({
  key,
  limit,
  window = "10 m",
  windowMs = 10 * 60 * 1000,
}) {
  const remoteRedis = getRedis();

  if (remoteRedis) {
    const limiterKey = `${limit}:${window}`;
    let limiter = remoteLimiters.get(limiterKey);
    if (!limiter) {
      limiter = new Ratelimit({
        redis: remoteRedis,
        limiter: Ratelimit.slidingWindow(limit, window),
        prefix: "devcore:ratelimit",
      });
      remoteLimiters.set(limiterKey, limiter);
    }
    return limiter.limit(key);
  }

  const now = Date.now();
  if (memoryBuckets.size > 10000) {
    for (const [bucketKey, bucket] of memoryBuckets) {
      if (bucket.reset <= now) memoryBuckets.delete(bucketKey);
    }
  }
  const current = memoryBuckets.get(key);
  if (!current || current.reset <= now) {
    const bucket = { count: 1, reset: now + windowMs };
    memoryBuckets.set(key, bucket);
    return { success: true, limit, remaining: limit - 1, reset: bucket.reset };
  }

  current.count += 1;
  return {
    success: current.count <= limit,
    limit,
    remaining: Math.max(0, limit - current.count),
    reset: current.reset,
  };
}

export function requestIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}
