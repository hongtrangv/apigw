import { Response, NextFunction, RequestHandler } from "express";
import * as uuid from "uuid"; // Thay đổi cách import
import { logger } from "../observability/logger";
import { maskHeaders } from "../utils/mask";
import { getContext } from "../utils/context";
import { GatewayRequest } from "../types/gateway";

export const requestLogger: RequestHandler = (
  req,
  res: Response,
  next: NextFunction
) => {
  const gwReq = req as GatewayRequest;

  // 1️⃣ RequestId + start time
  const id =
    (gwReq.headers["x-request-id"] as string) || uuid.v4(); // Sử dụng uuid.v4()

  gwReq.reqId = id;
  gwReq.startTime = Date.now();
  res.setHeader("x-request-id", id);

  // 2️⃣ Capture response body
  const oldSend = res.send.bind(res);
  let responseBody: any;

  res.send = (body?: any): Response => {
    responseBody = body;
    return oldSend(body);
  };

  // 3️⃣ Log when finished
  res.on("finish", () => {
    const ctx = getContext(gwReq);
    const duration =
      Date.now() - (gwReq.startTime || Date.now());

    const user = gwReq.user;

    const logData = {
      ...ctx,
      status: res.statusCode,
      durationMs: duration,
      user: user
        ? {
            sub: user.sub || user.id,
            username: user.username,
            roles: user.roles,
            scopes: user.scopes,
          }
        : null,
      request: {
        headers: maskHeaders(gwReq.headers),
        body: JSON.stringify(gwReq.body),
        query: gwReq.query,
      },
      response: {
        body: JSON.stringify(responseBody),
      },
    };

    const level =
      res.statusCode >= 500
        ? "error"
        : res.statusCode >= 400
        ? "warn"
        : "info";

    logger[level](logData, "HTTP request");
  });

  next();
};
