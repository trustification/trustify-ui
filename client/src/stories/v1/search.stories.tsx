import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import SearchPage from "@app/pages/search";
import { MemoryRouter } from "react-router";
import { NotificationsProvider } from "@app/components/NotificationsContext";
import { DefaultLayout } from "@app/layout";

const meta = {
  title: "v1/Search",
  component: SearchPage,
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={["/search"]}>
        <NotificationsProvider>
          <DefaultLayout>
            <Story />
          </DefaultLayout>
        </NotificationsProvider>
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof SearchPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};
