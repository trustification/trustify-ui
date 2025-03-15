import type { StorybookConfig } from 'storybook-react-rsbuild';

const config: StorybookConfig = {
  stories: ["../client/src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: 'storybook-react-rsbuild',
    options: {
      builder: {
        rsbuildConfigPath: './client/rsbuild.config.ts'
      },
    },
  },
  staticDirs: [
    {
      from: "../branding",
      to: "./branding",
    },
    "../client/src/app/images",
    "../client/public",
  ],
  rsbuildFinal: (config) => {
    return {
      ...config,
      source: {
        ...config.source,
        tsconfigPath: "./client/tsconfig.json",
      }
    };
  }
};
export default config;
