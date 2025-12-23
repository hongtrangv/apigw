import { Router } from "express";
import { oauthCheck } from "./middlewares/oauth";
import { rateLimit } from "./middlewares/rateLimit";
import { coreProxy } from "./proxies/core.proxy";
import { aiProxy } from "./proxies/ai.proxy";
import { policyAuth } from "./middlewares/policyAuth";
import { apiRegistryYaml } from "./middlewares/apiRegistryYaml";

const router = Router();
router.use("/api", oauthCheck, apiRegistryYaml, policyAuth, rateLimit, coreProxy);
router.use("/core", oauthCheck,policyAuth, rateLimit, coreProxy);
router.use("/ai", oauthCheck, policyAuth, rateLimit, aiProxy);

export default router;
