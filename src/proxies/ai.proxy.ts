import { createProxyMiddleware } from "http-proxy-middleware";
import { config } from "../config";

export const aiProxy = createProxyMiddleware({
  target: config.aiService,
  changeOrigin: true,
  pathRewrite: { "^/api/ai": "" },
});
