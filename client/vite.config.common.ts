import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import path from "path";

import { viteStaticCopy } from 'vite-plugin-static-copy'
import { createRequire } from 'module';

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
      name: 'ignore-process-env',
      transform(code) {
        return code.replace(/process\.env/g, '({})');
      },
    },
    viteStaticCopy({
      targets: [
        {
          src: manifestPath,
          dest: '.'
        },
        {
          src: brandingPath,
          dest: ".",
        },
        {
          src: faviconPath,
          dest: ".",
        },
      ]
    }),
  ],
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, "./src/app")
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom']
        },
      },
    },
  },
})



