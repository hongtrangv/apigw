import { Request, Response, NextFunction } from "express";

export const authorize =
  (options: { roles?: string[]; scopes?: string[] }) =>
  (req: Request, res: Response, next: NextFunction) => {
    const auth = (req as any).auth;

    if (!auth) {
      return res.status(401).json({ message: "Unauthenticated" });
    }

    const userRoles: string[] = auth["roles"] || auth["role"] || [];
    const userScopes: string[] = (auth.scope || "").split(" ");

    if (options.roles) {
      const ok = options.roles.some(r => userRoles.includes(r));
      if (!ok) {
        return res.status(403).json({ message: "Forbidden: role" });
      }
    }

    if (options.scopes) {
      const ok = options.scopes.every(s => userScopes.includes(s));
      if (!ok) {
        return res.status(403).json({ message: "Forbidden: scope" });
      }
    }

    next();
  };
