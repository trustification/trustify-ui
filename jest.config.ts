import type { Config } from "jest";

const config: Config = {
  testEnvironment: "jsdom", // or "node" for non-DOM tests
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@app/(.*)$": "<rootDir>/client/src/app/$1",
    "^@mocks/(.*)$": "<rootDir>/client/src/mocks/$1",
  },
  transform: {
    "^.+\\.[t|j]sx?$": "ts-jest", // Use ts-jest for TypeScript files
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};

export default config;
