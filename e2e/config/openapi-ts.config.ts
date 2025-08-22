import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  plugins: [
    "@hey-api/client-axios",
    {
      asClass: true, // default
      name: "@hey-api/sdk",
    },
  ],
  input: "config/openapi.yaml",
  output: {
    path: "tests/api/client",
    format: "prettier",
    lint: "eslint",
  },
});
