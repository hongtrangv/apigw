import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: Number(process.env.PORT || 3000),
  coreService: process.env.CORE_SERVICE_URL!,
  aiService: process.env.AI_SERVICE_URL!,
  redisUrl: process.env.REDIS_URL!,
  oauth: {
    issuer: process.env.OAUTH_ISSUER!,
    audience: process.env.OAUTH_AUDIENCE!,
  },
};
