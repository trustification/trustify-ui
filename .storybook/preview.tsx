import React from "react";
import "@patternfly/patternfly/patternfly.css";
import "@patternfly/patternfly/patternfly-addons.css";
import type { Preview } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { initialize, mswLoader } from "msw-storybook-addon";
import { handlers } from "@mocks/handlers";
import { AuthProvider } from "react-oidc-context";
import { MemoryRouter } from "react-router";

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
      <MemoryRouter initialEntries={["/"]}>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <Story />
          </QueryClientProvider>
        </AuthProvider>
      </MemoryRouter>
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
    options: {
      storySort: {
        order: ["v2.0", "v2.1", "v2.2", "v2.3", "v2.4"],
      },
    },
  },
};

export default preview;
