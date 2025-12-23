import { auth } from "express-oauth2-jwt-bearer";
import { config } from "../config";

export const oauthCheck = auth({
  issuerBaseURL: config.oauth.issuer,
  audience: config.oauth.audience,
  tokenSigningAlg: "RS256",
});
