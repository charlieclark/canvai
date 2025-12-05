/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";
import { withWorkflow } from "workflow/next";
import type { NextConfig } from "next";

const config: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lftz25oez4aqbxpq.public.blob.vercel-storage.com",
        port: "",
        pathname: "**",
        search: "",
      },
    ],
  },
  outputFileTracingIncludes: {
    // https://www.reddit.com/r/nextjs/comments/1ooc0pf/nextjs_16_prisma_on_vercel_runtime_error_and_fix/
    "/api/**/*": ["./node_modules/.prisma/client/**/*"],
    "/*": ["./node_modules/.prisma/client/**/*"],
  },
};

export default withWorkflow(config);
