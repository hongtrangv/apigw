import { GatewayRequest } from "../types/gateway";
import { GatewayContext } from "../types/context";

export function getContext(req: GatewayRequest): GatewayContext {
  return {
    reqId: req.reqId || "",
    method: req.method,
    path: req.originalUrl || req.path,
    ip: req.ip,

    userId: req.user?.sub || req.user?.id,
    username: req.user?.username,
    roles: req.user?.roles,
    scopes: req.user?.scopes,

    apiId: req.apiMeta?.id,
    apiTarget: req.apiMeta?.target,

    clientId: (req as any).clientId,
    apiKey: (req as any).apiKey,

    startTime: req.startTime,
  };
}
