import express from "express";
import cors, { CorsOptions } from "cors";
import helmet from "helmet";
import router from "./routes";
import { config } from "./config";
import { metricsMiddleware, metricsEndpoint } from "./middlewares/metrics";
import { requestLogger } from "./middlewares/requestLogger";
import adminApiRoutes from "./admin/apiRegistry.routes";
import { oauthCheck } from "./middlewares/oauth";
import { authorize } from "./middlewares/authorize";
import { loadApis } from "./services/apiRegistryYaml";
import { errorHandler } from "./middlewares/errorHandler";
console.log("Node version:", process.version);
console.log("Express version:", require("express/package.json").version);

const app = express();
// Cấu hình CORS an toàn
const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS ? process.env.CORS_ALLOWED_ORIGINS.split(',') : [];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

loadApis();

app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());
app.use(requestLogger);
app.use(metricsMiddleware);
app.use(
  "/admin/apis",
  oauthCheck,
  authorize({ roles: ["admin"] }),
  adminApiRoutes
);
app.get("/health", (_, res) => res.json({ status: "ok" }));
app.get("/metrics", metricsEndpoint);

app.use("/api",router);

// Thêm trình xử lý lỗi làm middleware cuối cùng
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`API Gateway running on ${config.port}`);
});
