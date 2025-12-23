import { createProxyMiddleware } from "http-proxy-middleware";
import { config } from "../config";

export const coreProxy = createProxyMiddleware({
  target: config.coreService,
  changeOrigin: true,
  pathRewrite: { "^/api/core": "" },
});
