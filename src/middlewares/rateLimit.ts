import Redis from "ioredis";
import { RateLimiterRedis } from "rate-limiter-flexible";
import { config } from "../config";

const redis = new Redis(config.redisUrl);

const rateLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: "rlflx",
  points: 100, // 100 requests
  duration: 60, // per 60s
});

export const rateLimit = async (req: any, res: any, next: any) => {
  try {
    await rateLimiter.consume(req.ip);
    next();
  } catch {
    res.status(429).json({ message: "Too Many Requests" });
  }
};

export default redis;
