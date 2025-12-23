export interface GatewayContext {
    reqId: string;
    method: string;
    path: string;
    ip?: string;
  
    userId?: string;
    username?: string;
    roles?: string[];
    scopes?: string[];
  
    apiId?: string;
    apiTarget?: string;
  
    clientId?: string;
    apiKey?: string;
  
    startTime?: number;
  }
  