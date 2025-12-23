import { Router } from "express";
import { pool } from "../db";
import { z } from "zod";

const router = Router();

const ApiSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  path: z.string(),
  methods: z.array(z.string()),
  target: z.string(),
  rewrite: z.string().optional(),
  scopes: z.array(z.string()).optional(),
  status: z.enum(["draft", "published", "disabled", "deprecated"]).default("draft"),
});

// Create
router.post("/", async (req, res) => {
  const data = ApiSchema.parse(req.body);

  await pool.query(
    `INSERT INTO api_registry
     (id, name, path, methods, target, rewrite, scopes, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
    [
      data.id,
      data.name,
      data.path,
      data.methods,
      data.target,
      data.rewrite,
      data.scopes,
      data.status,
    ]
  );

  res.json({ message: "API created", id: data.id });
});

// List
router.get("/", async (_, res) => {
  const { rows } = await pool.query(`SELECT * FROM api_registry ORDER BY created_at DESC`);
  res.json(rows);
});

// Update
router.put("/:id", async (req, res) => {
  const data = ApiSchema.partial().parse(req.body);

  const fields = Object.keys(data);
  const values = Object.values(data);

  const sets = fields.map((f, i) => `${f}=$${i + 1}`).join(", ");

  await pool.query(
    `UPDATE api_registry SET ${sets}, updated_at=NOW() WHERE id=$${fields.length + 1}`,
    [...values, req.params.id]
  );

  res.json({ message: "API updated" });
});

// Publish
router.post("/:id/publish", async (req, res) => {
  await pool.query(
    `UPDATE api_registry SET status='published', updated_at=NOW() WHERE id=$1`,
    [req.params.id]
  );
  res.json({ message: "API published" });
});

// Disable
router.post("/:id/disable", async (req, res) => {
  await pool.query(
    `UPDATE api_registry SET status='disabled', updated_at=NOW() WHERE id=$1`,
    [req.params.id]
  );
  res.json({ message: "API disabled" });
});

export default router;
