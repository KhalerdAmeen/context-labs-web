import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    ".next-waitlist/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // The Claude Design export (and its runtime) is a spec, not app code.
    "design/**",
    // Conductor scratch space (screenshots, one-off scripts)
    ".context/**",
  ]),
]);

export default eslintConfig;
