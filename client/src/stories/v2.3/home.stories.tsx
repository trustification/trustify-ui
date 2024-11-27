import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { MemoryRouter } from "react-router";
import Home from "@app/pages/home";
import { NotificationsProvider } from "@app/components/NotificationsContext";
import { DefaultLayout } from "@app/layout";

const meta = {
  title: "v2.3/Home",
  component: () => {
    return <>An example custom homepage for v2.3</>;
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={["/"]}>
        <NotificationsProvider>
          <DefaultLayout>
            <Story />
          </DefaultLayout>
        </NotificationsProvider>
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof Home>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};
