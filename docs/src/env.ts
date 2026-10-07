import { z } from "zod";

const stripTrailingSlash = (value: string) => value.replace(/\/+$/u, "");

const clientEnvSchema = z.object({
  /**
   * Public LTI tool origin (login, launch, deep link, JWKS).
   * Mirrors API `LTI_TOOL_BASE_URL` - local API by default, production host in deploy.
   */
  LTI_TOOL_BASE_URL: z.string().url(),
  /** Marketing / web app origin - “back to site” from docs. */
  VITE_WEB_URL: z.string().url(),
});

const rawLtiToolBaseUrl =
  import.meta.env.VITE_LTI_TOOL_BASE_URL ||
  import.meta.env.LTI_TOOL_BASE_URL ||
  "http://127.0.0.1:3000";

export const env = clientEnvSchema.parse({
  LTI_TOOL_BASE_URL: stripTrailingSlash(String(rawLtiToolBaseUrl)),
  VITE_WEB_URL: stripTrailingSlash(
    import.meta.env.VITE_WEB_URL || "http://localhost:5173",
  ),
});
