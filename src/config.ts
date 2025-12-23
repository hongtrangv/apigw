import dotenv from "dotenv";
//dotenv.config();

// Hàm trợ giúp để lấy và xác thực các biến môi trường
function getEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Biến môi trường ${key} chưa được đặt.`);
  }
  return value;
}

export const config = {
  port: Number(process.env.PORT || 3000),
  coreService: getEnv("CORE_SERVICE_URL"),
  aiService: getEnv("AI_SERVICE_URL"),
  redisUrl: getEnv("REDIS_URL"),
  oauth: {
    issuer: getEnv("OAUTH_ISSUER"),
    audience: getEnv("OAUTH_AUDIENCE"),
  },
};
