import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The e2e suite runs a second dev server (waitlist mode) next to the first (library mode);
  // Next allows one dev server per build folder, so the second gets its own. Unset everywhere else.
  distDir: process.env.NEXT_DIST_DIR || ".next",
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
