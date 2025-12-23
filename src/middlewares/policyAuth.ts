import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import micromatch from "micromatch";
import { Request, Response, NextFunction } from "express";

interface Policy {
  id: string;
  effect: "allow" | "deny";
  routes: { path: string; methods: string[] }[];
  subjects?: { roles?: string[]; scopes?: string[] };
  conditions?: any[];
}

let policyDoc: { policies: Policy[] };

const loadPolicy = () => {
  const file = fs.readFileSync(
    path.join(process.cwd(), "policies/policy.yaml"),
    "utf8"
  );
  policyDoc = yaml.load(file) as any;
};

loadPolicy();

export const policyAuth = (req: Request, res: Response, next: NextFunction) => {
  const auth = (req as any).auth;
  const userRoles: string[] = auth?.roles || [];
  const userScopes: string[] = (auth?.scope || "").split(" ");

  const reqPath = req.baseUrl + req.path;
  const method = req.method;

  for (const p of policyDoc.policies) {
    const routeMatch = p.routes.some(r =>
      r.methods.includes(method) &&
      micromatch.isMatch(reqPath, r.path.replace(/\{.*?\}/g, "*"))
    );

    if (!routeMatch) continue;

    // RBAC
    if (p.subjects?.roles) {
      if (!p.subjects.roles.some(r => userRoles.includes(r))) continue;
    }

    // Scope
    if (p.subjects?.scopes) {
      if (!p.subjects.scopes.every(s => userScopes.includes(s))) continue;
    }

    // ABAC conditions
    if (p.conditions) {
      const ok = p.conditions.every(c => evaluate(c, req, auth));
      if (!ok) continue;
    }

    if (p.effect === "allow") return next();
    if (p.effect === "deny") {
      return res.status(403).json({ message: "Forbidden by policy", policy: p.id });
    }
  }

  return res.status(403).json({ message: "Forbidden: no matching policy" });
};

const evaluate = (cond: any, req: Request, user: any): boolean => {
  const getVal = (expr: string) => {
    if (expr.startsWith("request.")) {
      return expr.split(".").slice(1).reduce((o, k) => (o as any)?.[k], req as any);
    }
    if (expr.startsWith("user.")) {
      return expr.split(".").slice(1).reduce((o, k) => o?.[k], user);
    }
    return expr;
  };

  const left = getVal(cond.left);
  const right = getVal(cond.right);

  switch (cond.type) {
    case "equals":
      return left == right;
    case "notEquals":
      return left != right;
    default:
      return false;
  }
};
