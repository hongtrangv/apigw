import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../logger";
import { maskHeaders } from "../utils/mask";

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const requestId = uuidv4();

  (req as any).requestId = requestId;

  // Capture response body
  const oldSend = res.send;
  let responseBody: any;

  res.send = function (body?: any): Response {
    responseBody = body;
    return oldSend.call(this, body);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    const user = (req as any).auth || (req as any).user;

    const logData = {
      requestId,
      time: new Date().toISOString(),
      ip: req.ip,
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      durationMs: duration,
      user: user
        ? {
            sub: user.sub || user.id,
            email: user.email,
            scope: user.scope,
          }
        : null,
      request: {
        headers: maskHeaders(req.headers),
        body: req.body,
        query: req.query,
      },
      response: {
        body: responseBody,
      },
    };

    logger.info(logData);
  });

  next();
};
