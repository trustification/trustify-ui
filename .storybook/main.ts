import type { StorybookConfig } from "@storybook/react-webpack5";

import path, { join, dirname } from "path";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, "package.json")));
}
const config: StorybookConfig = {
  stories: [
    "../client/src/**/*.mdx",
    "../client/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    getAbsolutePath("@storybook/addon-webpack5-compiler-swc"),
    getAbsolutePath("@storybook/addon-links"),
    getAbsolutePath("@storybook/addon-essentials"),
    getAbsolutePath("@chromatic-com/storybook"),
    getAbsolutePath("@storybook/addon-interactions"),
  ],
  framework: {
    name: getAbsolutePath("@storybook/react-webpack5"),
    options: {},
  },
  staticDirs: [
    "../public",
    "../branding/images",
    "../client/public",
    "../client/src/app/images",
  ],
  typescript: {
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      compilerOptions: {
        allowSyntheticDefaultImports: false,
        esModuleInterop: false,
      },
    },
  },
  webpackFinal: async (config) => {
    if (config.resolve) {
      config.resolve.plugins = [
        ...(config.resolve.plugins || []),
        new TsconfigPathsPlugin({
          configFile: path.resolve(__dirname, "../client/tsconfig.json"),
          extensions: config.resolve.extensions,
        }),
      ];
    }
    if (config.module) {
      // remove svg from existing rule
      config.module.rules = config.module.rules?.map((rule: any) => {
        if (
          String(rule.test) ===
          String(
            /\.(svg|ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani)(\?.*)?$/
          )
        ) {
          return {
            ...rule,
            test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani)(\?.*)?$/,
          };
        }

        return rule;
      });
    }

    return config;
  },
};
export default config;
