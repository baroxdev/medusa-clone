import { defineConfig } from "tsup";

export default defineConfig((options) => ({
    entry: ["src/index.ts"],
    format: ["cjs", "esm"],
    dts: true,
    external: ["react"],
    ...options,
}));
