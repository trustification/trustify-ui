import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import Home from "@app/pages/home";
import { NotificationsProvider } from "@app/components/NotificationsContext";
import { DefaultLayout } from "@app/layout";

const meta = {
  title: "v2.1/Home",
  component: () => {
    return <>An example custom homepage for v2.1</>;
  },
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
