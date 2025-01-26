import {defineConfig} from 'vite';
import {ViteEjsPlugin} from "vite-plugin-ejs";

import {
  brandingStrings,
  encodeEnv,
  SERVER_ENV_KEYS,
  TRUSTIFICATION_ENV,
  proxyMap
} from "@trustify-ui/common";

import commonViteConfiguration from "./vite.config.common.ts";

// https://vite.dev/config/
export default defineConfig({
  ...commonViteConfiguration,
  plugins: [
    ...[commonViteConfiguration.plugins],
    ViteEjsPlugin({
      _env: encodeEnv(TRUSTIFICATION_ENV, SERVER_ENV_KEYS),
      branding: brandingStrings,
    }),
  ],
  server: {
    proxy: proxyMap
  }
})



