import fs from "fs";
import path from "path";
import { createRequire } from "module";

import { defineConfig } from "vite";
import { ViteEjsPlugin } from "vite-plugin-ejs";
import { viteStaticCopy } from "vite-plugin-static-copy";
import react from "@vitejs/plugin-react";

import {
  brandingStrings,
  encodeEnv,
  proxyMap,
  SERVER_ENV_KEYS,
  TRUSTIFICATION_ENV,
} from "@trustify-ui/common";

const require = createRequire(import.meta.url);
const { brandingAssetPath } = require("@trustify-ui/common");

const brandingPath: string = brandingAssetPath();
const manifestPath = path.resolve(brandingPath, "manifest.json");
const faviconPath = path.resolve(brandingPath, "favicon.ico");

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: "ignore-process-env",
      transform(code) {
        return code.replace(/process\.env/g, "({})");
      },
    },
    viteStaticCopy({
      targets: [
        {
          src: manifestPath,
          dest: ".",
        },
        {
          src: brandingPath,
          dest: ".",
        },
        {
          src: faviconPath,
          dest: ".",
        },
      ],
    }),
    ...(process.env.NODE_ENV === "development"
      ? [
          ViteEjsPlugin({
            _env: encodeEnv(TRUSTIFICATION_ENV, SERVER_ENV_KEYS),
            branding: brandingStrings,
          }),
        ]
      : []),
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
      : []),
  ],
  resolve: {
    alias: {
      "@app": path.resolve(__dirname, "./src/app"),
      "@mocks": path.resolve(__dirname, "./src/mocks"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
        },
      },
    },
  },
  server: {
    proxy: proxyMap,
  },
});
