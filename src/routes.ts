import { Router } from "express";
import { oauthCheck } from "./middlewares/oauth";
import { rateLimit } from "./middlewares/rateLimit";
import { coreProxy } from "./proxies/core.proxy";
import { aiProxy } from "./proxies/ai.proxy";
import { policyAuth } from "./middlewares/policyAuth";

const router = Router();
router.use("/core", oauthCheck,policyAuth, rateLimit, coreProxy);
router.use("/ai", oauthCheck, policyAuth, rateLimit, aiProxy);

export default router;
