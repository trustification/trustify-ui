import type { StorybookConfig } from "@storybook/react-vite";

import { mergeConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const config: StorybookConfig = {
  stories: ["../client/src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-onboarding",
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  async viteFinal(config, options) {
    return mergeConfig(config, {
      plugins: [
        {
          name: "ignore-process-env",
          transform(code) {
            return code.replace(/process\.env/g, "({})");
          },
        },
        tsconfigPaths({
          projects: ["./client/"],
        }),
      ]
    });
  },
};
export default config;
