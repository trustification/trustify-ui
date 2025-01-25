import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, "./src/app")
      // '@trustify-ui/common': "/home/cferiavi/git/trustification/trustify-ui/common/dist", // Alias for @trustify-ui/common
    },
  },
  // build: {
  //   rollupOptions: {
  //     // external: ['/home/cferiavi/git/trustification/trustify-ui/client/src/index.tsx'],
  //     external: [
  //       "@trustify-ui/common"
  //     ],
  //     onwarn: (warning) => {
  //       console.log(warning);
  //     }
  //   }
  // }
})
