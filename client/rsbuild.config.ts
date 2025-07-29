import * as fs from "node:fs";
import * as path from "node:path";

import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

import type { RsbuildPlugin } from "@rsbuild/core";
import { pluginTypeCheck } from "@rsbuild/plugin-type-check";

import {
  SERVER_ENV_KEYS,
  TRUSTIFICATION_ENV,
  brandingStrings,
  encodeEnv,
  proxyMap,
} from "@trustify-ui/common";

/**
 * Return the `node_modules/` resolved path for the branding assets.
 */
const brandingAssetPath = () =>
  `${require
    .resolve("@trustify-ui/common/package.json")
    .replace(/(.)\/package.json$/, "$1")}/dist/branding`;

const brandingPath: string = brandingAssetPath();
const manifestPath = path.resolve(brandingPath, "manifest.json");
const faviconPath = path.resolve(brandingPath, "favicon.ico");

export const renameIndex = (): RsbuildPlugin => ({
  name: "CopyIndex",
  setup(api) {
    if (process.env.NODE_ENV === "production") {
      api.onAfterBuild(() => {
        const distDir = path.resolve(__dirname, "dist");
        const src = path.join(distDir, "index.html");
        const dest = path.join(distDir, "index.html.ejs");

        if (fs.existsSync(src)) {
          fs.renameSync(src, dest);
        }
      });
    }
  },
});

export const ignoreProcessEnv = (): RsbuildPlugin => ({
  name: "ignore-process-env",
  setup(api) {
    if (process.env.NODE_ENV === "development") {
      api.transform({ test: /\.mjs$/ }, ({ code, resourcePath }) => {
        let newCode = code;
        if (
          code.includes("process.env") &&
          resourcePath.includes("/common/dist/index.mjs")
        ) {
          newCode = code.replace(/process\.env/g, "({})");
        }
        return newCode;
      });
    }
    if (process.env.NODE_ENV === "production") {
      api.onAfterBuild(() => {
        const replaceProcessEnv = (dir: string): void => {
          const files = fs.readdirSync(dir);
          for (const file of files) {
            const filePath = path.join(dir, file);
            const fileStat = fs.statSync(filePath);
            if (fileStat?.isDirectory()) {
              replaceProcessEnv(filePath);
            } else if (file.endsWith(".js")) {
              let code = fs.readFileSync(filePath, "utf-8");
              code = code.replace(/process\.env/g, "({})");
              fs.writeFileSync(filePath, code);
            }
          }
        };

        const distDir = path.resolve(__dirname, "dist");
        replaceProcessEnv(distDir);
      });
    }
  },
});

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginTypeCheck({
      enable: process.env.NODE_ENV === "production",
      tsCheckerOptions: {
        issue: {
          exclude: [
            ({ file = "" }) => /[\\/]node_modules[\\/]/.test(file),
            ({ file = "" }) => {
              return /\/src\/app\/client(?:\/[^/]+)*\/[^/]+\.ts$/.test(file);
            },
          ],
        },
      },
    }),
    renameIndex(),
    ignoreProcessEnv(),
  ],
  html: {
    template: path.join(__dirname, "index.html"),
    templateParameters: {
      ...(process.env.NODE_ENV === "development" && {
        _env: encodeEnv(TRUSTIFICATION_ENV, SERVER_ENV_KEYS),
        branding: brandingStrings,
      }),
    },
  },
  tools: {
    rspack(_config, { addRules }) {
      addRules([
        ...(process.env.NODE_ENV === "production"
          ? [
              {
                test: /\.html$/,
                use: "raw-loader", // Ensures HTML remains unprocessed
              },
            ]
          : []),
      ]);
    },
    swc: {
      jsc: {
        experimental: {
          plugins:
            process.env.NODE_ENV === "development"
              ? [["swc-plugin-coverage-instrument", {}]]
              : [],
        },
      },
    },
  },
  output: {
    copy: [
      {
        from: manifestPath,
        to: ".",
      },
      {
        from: faviconPath,
        to: ".",
      },
      {
        from: brandingPath,
        to: "branding",
      },
    ],
    sourceMap: process.env.NODE_ENV === "development",
  },
  server: {
    proxy: proxyMap,
  },
});
