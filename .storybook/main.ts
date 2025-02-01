import { mergeConfig } from "vite";
import type { StorybookConfig } from "@storybook/react-vite";
import tsconfigPaths from "vite-tsconfig-paths";
import commonConfig from "../client/vite.config.common";

const config: StorybookConfig = {
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  stories: ["../client/src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
  ],

  async viteFinal(config, options) {
    const viteConfig = mergeConfig(config, {
      plugins: [
        tsconfigPaths({
          projects: ["./client/"],
        }),
      ],
    });
    return mergeConfig(commonConfig, viteConfig);
  },
};

export default config;
