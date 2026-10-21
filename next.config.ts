import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // The download routes read files the bundler can't see through imports: both load the content
  // index (slug ↔ zip), and /api/file streams the zip itself. Ship those files with them.
  outputFileTracingIncludes: {
    "/api/download": ["./content/**/*"],
    "/api/file": ["./content/**/*"],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
