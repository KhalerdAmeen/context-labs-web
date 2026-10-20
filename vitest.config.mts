import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": import.meta.dirname,
      // the real package throws outside React Server Components; tests import server modules directly
      "server-only": `${import.meta.dirname}/tests/stubs/empty.ts`,
    },
  },
  test: { include: ["tests/**/*.test.ts"], environment: "node" },
});
