import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import SearchPage from "@app/pages/search";
import { NotificationsProvider } from "@app/components/NotificationsContext";
import { DefaultLayout } from "@app/layout";

const CustomBody: React.FC = () => {
  return <div>Custom body for search page</div>;
};

const meta = {
  title: "v2.0/Search",
  component: SearchPage,
  decorators: [
    (Story) => (
      <NotificationsProvider>
        <DefaultLayout>
          <Story />
        </DefaultLayout>
      </NotificationsProvider>
    ),
  ],
} satisfies Meta<typeof SearchPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const WithCustomBody: Story = {
  args: {
    searchBodyOverride: <CustomBody />,
  },
};
