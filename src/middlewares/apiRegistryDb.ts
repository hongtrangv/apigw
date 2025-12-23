import { Request, Response, NextFunction } from "express";
import micromatch from "micromatch";
import { pool } from "../db";

export const apiRegistryDb = async (req: Request, res: Response, next: NextFunction) => {
  const fullPath = req.baseUrl + req.path;
  const method = req.method;

  const { rows } = await pool.query(
    `SELECT * FROM api_registry WHERE $1 = ANY(methods)`,
    [method]
  );

  const api = rows.find((a: any) => micromatch.isMatch(fullPath, a.path));

  if (!api) {
    return res.status(404).json({ message: "API not registered" });
  }

  if (api.status !== "published") {
    return res.status(403).json({
      message: `API not published`,
      status: api.status,
      api: api.id,
    });
  }

  (req as any).apiMeta = api;
  next();
};
