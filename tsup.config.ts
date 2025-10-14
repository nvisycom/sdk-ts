import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  minify: false,
  external: ["axios"],
  outDir: "dist",
  target: "es2020",
  platform: "neutral",
  treeshake: true,
  bundle: true,
  skipNodeModulesBundle: true,
});
