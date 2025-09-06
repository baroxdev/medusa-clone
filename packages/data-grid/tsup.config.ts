import {defineConfig} from 'tsup'

export default defineConfig((options) =>({
    entry: ["./src/index.ts"],
    format: ["cjs", "esm"],
    external: ["react"],
    clean: true,
    tsconfig: "tsconfig.build.json",
    outDir: "dist",
}))
