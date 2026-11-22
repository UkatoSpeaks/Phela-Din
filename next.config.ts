import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The API route reads content/ from disk at runtime (to look up AI task
  // rubrics). Make sure Vercel bundles those files with the function.
  outputFileTracingIncludes: {
    "/api/ai-feedback": ["./content/**/*.json"],
  },
};

export default nextConfig;
