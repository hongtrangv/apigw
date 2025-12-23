import { Request, Response, NextFunction } from "express";
import micromatch from "micromatch";
import { getApis } from "../services/apiRegistryYaml";

export const apiRegistryYaml = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const fullPath = req.baseUrl + req.path;
  const method = req.method;

  const apis = getApis();

  const api = apis.find(
    a =>
      a.methods.includes(method) &&
      micromatch.isMatch(fullPath, a.path)
  );

  if (!api) {
    return res.status(404).json({ message: "API not registered" });
  }

  if (api.status !== "published") {
    return res.status(403).json({
      message: "API not published",
      status: api.status,
      api: api.id,
    });
  }

  (req as any).apiMeta = api;
  next();
};
