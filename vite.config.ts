import { defineConfig } from "vite";
import { ViteEjsPlugin } from "vite-plugin-ejs";
import dynamicImport from "vite-plugin-dynamic-import";
const path = require("path");
const { parsed } = require("dotenv").config({
  path: path.resolve(__dirname, "./src/.env"),
});

export default defineConfig(({ mode }) => {
  return {
    root: "./src",
    rollupOptions: {
      input: "vite-single-spa-root-config.ts",
      format: "system",
      preserveEntrySignatures: true,
    },
    build: {
      outDir: "../dist",
      emptyOutDir: true,
      cssCodeSplit: false,
      rollupOptions: {
        input: {
          main: "./src/index.html",
          "vite-single-spa-root-config": "./src/vite-single-spa-root-config.ts",
        },
        preserveEntrySignatures: true,
        output: {
          entryFileNames: "[name].js",
          assetFileNames: "assets/[name].[ext]",
        },
      },
    },
    resolve: {
      fullySpecified: false,
      modules: ["node_modules"],
    },
    define: {
      define: "undefined",
      "global.TYPED_ARRAY_SUPPORT": undefined,
    },
    plugins: [
      ViteEjsPlugin((config) => ({
        isLocal: config.mode === "development",
        ...parsed
      })),
      dynamicImport(),
    ],
  };
});
