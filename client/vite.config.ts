/// <reference types="vitest/config" />

import fs from "fs";
import { createRequire } from "module";
import path from "path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { ViteEjsPlugin } from "vite-plugin-ejs";
import istanbul from "vite-plugin-istanbul";
import { viteStaticCopy } from "vite-plugin-static-copy";

import {
  SERVER_ENV_KEYS,
  TRUSTIFICATION_ENV,
  brandingStrings,
  encodeEnv,
} from "@trustify-ui/common";

const require = createRequire(import.meta.url);
export const brandingAssetPath = () =>
  require
    .resolve("@trustify-ui/common/package.json")
    .replace(/(.)\/package.json$/, "$1") + "/dist/branding";

const brandingPath: string = brandingAssetPath();
const manifestPath = path.resolve(brandingPath, "manifest.json");
const faviconPath = path.resolve(brandingPath, "favicon.ico");

export default defineConfig({
  plugins: [
    react(),
    ...(process.env.COVERAGE === "true"
      ? [
          istanbul({
            include: "src/*",
            exclude: ["node_modules", "test/"],
            extension: [".js", ".jsx", ".ts", ".tsx"],
            requireEnv: false,
            checkProd: false,
            forceBuildInstrument: true,
          }),
        ]
      : []),
    {
      name: "ignore-process-env",
      transform(code) {
        return code.replace(/process\.env/g, "({})");
      },
    },
    viteStaticCopy({
      targets: [
        { src: manifestPath, dest: ".", rename: { stripBase: true } },
        { src: faviconPath, dest: ".", rename: { stripBase: true } },
        { src: brandingPath, dest: ".", rename: { stripBase: 2 } },
      ],
    }),
    ...(process.env.NODE_ENV === "production"
      ? [
          {
            name: "copy-index",
            closeBundle: () => {
              const distDir = path.resolve(__dirname, "dist");
              const src = path.join(distDir, "index.html");
              const dest = path.join(distDir, "index.html.ejs");

              if (fs.existsSync(src)) {
                fs.renameSync(src, dest);
              }
            },
          },
        ]
      : [
          ViteEjsPlugin({
            _env: encodeEnv(TRUSTIFICATION_ENV, SERVER_ENV_KEYS),
            branding: brandingStrings,
          }),
        ]),
  ],
  resolve: {
    alias: {
      "@app": path.resolve(__dirname, "./src/app"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (
            id.includes("node_modules/react-dom") ||
            id.includes("node_modules/react/")
          ) {
            return "react";
          }
        },
      },
    },
    sourcemap: process.env.NODE_ENV === "development",
  },
  server: {
    proxy: {
      "/auth": {
        target: TRUSTIFICATION_ENV.OIDC_SERVER_URL || "http://localhost:8090",
        changeOrigin: true,
      },
      "/api": {
        target: TRUSTIFICATION_ENV.TRUSTIFY_API_URL || "http://localhost:8080",
        changeOrigin: true,
        selfHandleResponse: true,
        configure: (proxy) => {
          proxy.on("proxyRes", (proxyRes, _req, res) => {
            const chunks: Buffer[] = [];
            proxyRes.on("data", (chunk: Buffer) => chunks.push(chunk));
            proxyRes.on("end", () => {
              const body = Buffer.concat(chunks);
              const headers = { ...proxyRes.headers };
              delete headers["transfer-encoding"];
              delete headers["connection"];
              headers["content-length"] = String(body.length);
              res.writeHead(proxyRes.statusCode ?? 200, headers);
              res.end(body);
            });
          });
        },
      },
      "/.well-known/trustify": {
        target: TRUSTIFICATION_ENV.TRUSTIFY_API_URL || "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./test-setup.ts",
    server: {
      deps: {
        inline: ["@patternfly/react-styles", "@trustify-ui/common"],
      },
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      reportsDirectory: "./coverage",
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "**/*.test.{ts,tsx}",
        "**/*.spec.{ts,tsx}",
        "**/node_modules/**",
        "**/dist/**",
        "**/coverage/**",
        "**/*.d.ts",
        "**/test-setup.ts",
        "**/vite.config.ts",
        "**/types/**",
      ],
    },
  },
});
