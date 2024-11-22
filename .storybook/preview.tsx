import React from "react";
import "@patternfly/patternfly/patternfly.css";
import "@patternfly/patternfly/patternfly-addons.css";
import type { Preview } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { initialize, mswLoader } from "msw-storybook-addon";
import { handlers } from "@mocks/handlers";
const queryClient = new QueryClient();

if (typeof jest === "undefined") {
  // Mock Jest in the Storybook runtime
  globalThis.jest = {
    fn: () => {
      const mockFn = () => {};
      mockFn.mockReturnValue = () => mockFn;
      mockFn.mockReturnValueOnce = () => mockFn;
      mockFn.mockImplementation = () => mockFn;
      return mockFn;
    },
  } as any;
}

/*
 * Initializes MSW
 * See https://github.com/mswjs/msw-storybook-addon#configuring-msw
 * to learn how to customize it
 */
initialize();

const preview: Preview = {
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    ),
  ],
  loaders: [mswLoader],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    msw: {
      handlers: [...handlers],
    },
  },
};

export default preview;
