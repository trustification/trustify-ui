import {defineConfig} from 'vite';

import commonViteConfiguration from "./vite.config.common.ts";

// https://vite.dev/config/
export default defineConfig({
  ...commonViteConfiguration,
  plugins: [
    ...[commonViteConfiguration.plugins],
    {
      name: 'html-transform',
      transformIndexHtml(html) {
        return html;
      },
    }
  ]
})



