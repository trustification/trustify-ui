import fs from 'fs';
import path from "path";
import { defineConfig, mergeConfig } from "vite";
import commonConfig from "./vite.config.common";

// https://vite.dev/config/
const prodConfig = defineConfig({
  plugins: [
    ...[commonConfig.plugins],
    {
      name: "html-transform",
      transformIndexHtml(html) {
        return html;
      },
    },
    {
      name: 'copy-index',
      closeBundle: ()=> {
        const distDir = path.resolve(__dirname, 'dist');
        const src = path.join(distDir, 'index.html');
        const dest = path.join(distDir, 'index.html.ejs');

        if (fs.existsSync(src)) {
          fs.renameSync(src, dest);
        }
      },
    },
  ],
});

export default defineConfig(mergeConfig(commonConfig, prodConfig));
