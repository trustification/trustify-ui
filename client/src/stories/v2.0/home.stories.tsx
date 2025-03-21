import React from "react";

import { NotificationsProvider } from "@app/components/NotificationsContext";
import { DefaultLayout } from "@app/layout";
import Home from "@app/pages/home";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "v2.0/Home",
  component: Home,
  decorators: [
    (Story) => (
      <NotificationsProvider>
        <DefaultLayout>
          <Story />
        </DefaultLayout>
      </NotificationsProvider>
    ),
  ],
} satisfies Meta<typeof Home>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};
