import { defineConfig, mergeConfig } from "vite";
import { ViteEjsPlugin } from "vite-plugin-ejs";

import {
  brandingStrings,
  encodeEnv,
  SERVER_ENV_KEYS,
  TRUSTIFICATION_ENV,
  proxyMap,
} from "@trustify-ui/common";

import commonConfig from "./vite.config.common";

// https://vite.dev/config/
const devConfig = defineConfig({
  plugins: [
    ...[commonConfig.plugins],
    ViteEjsPlugin({
      _env: encodeEnv(TRUSTIFICATION_ENV, SERVER_ENV_KEYS),
      branding: brandingStrings,
    }),
  ],
  server: {
    proxy: proxyMap,
  },
});

export default defineConfig(mergeConfig(commonConfig, devConfig));
