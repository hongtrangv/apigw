import fs from "fs";
import path from "path";
import yaml from "js-yaml";

export interface ApiMeta {
  id: string;
  name?: string;
  path: string;
  methods: string[];
  target: string;
  rewrite?: string;
  status: string;
  scopes?: string[];
}

let cache: ApiMeta[] = [];

const filePath =
  process.env.APIS_CONFIG_PATH ||
  path.join(process.cwd(), "configs/apis.yaml");

export function loadApis() {
  const raw = fs.readFileSync(filePath, "utf8");
  const doc = yaml.load(raw) as any;
  cache = doc.apis || [];
  console.log(`✅ Loaded ${cache.length} APIs from YAML`);
  return cache;
}

export function getApis() {
  return cache;
}

// hot reload khi file đổi
fs.watch(filePath, () => {
  try {
    loadApis();
    console.log("🔄 APIs YAML reloaded");
  } catch (e) {
    console.error("❌ Failed to reload apis.yaml", e);
  }
});
