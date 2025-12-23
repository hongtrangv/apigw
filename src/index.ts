import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes";
import { config } from "./config";
import { metricsMiddleware, metricsEndpoint } from "./middlewares/metrics";
import { requestLogger } from "./middlewares/requestLogger";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("combined"));
app.use(requestLogger);
app.use(metricsMiddleware);

app.get("/health", (_, res) => res.json({ status: "ok" }));
app.get("/metrics", metricsEndpoint);

app.use("/api", routes);

app.listen(config.port, () => {
  console.log(`API Gateway running on ${config.port}`);
});
