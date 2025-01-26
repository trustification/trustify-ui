import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'ignore-process-env',
      transform(code) {
        return code.replace(/process\.env/g, '({})');
      },
    }
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



