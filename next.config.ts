import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // The download routes read files the bundler can't see through imports: /api/download loads the
  // content index to map a slug to its zip, /api/file streams the zip. Ship those files with them.
  outputFileTracingIncludes: {
    "/api/download": ["./content/**/*"],
    "/api/file": ["./content/kits/context-labs/files/*.zip"],
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
