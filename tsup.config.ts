import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  minify: true,
  splitting: false,
  treeshake: true,
  external: ["react"],
  sourcemap: true,
});
