import { Request } from "express";

export interface ApiMeta {
  id: string;
  name?: string;
  target: string;
  path: string;
  methods: string[];
  status: string;
  scopes?: string[];
  rewrite?: string;
}

export interface GatewayUser {
  sub?: string;
  id?: string;
  username?: string;
  roles?: string[];
  scopes?: string[];
  [key: string]: any;
}

export interface GatewayRequest extends Request {
  reqId?: string;
  startTime?: number;
  user?: GatewayUser;
  apiMeta?: ApiMeta;
  clientId?: string;
  apiKey?: string;
}
