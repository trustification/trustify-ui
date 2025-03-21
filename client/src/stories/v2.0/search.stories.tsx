import type React from "react";

import { NotificationsProvider } from "@app/components/NotificationsContext";
import { DefaultLayout } from "@app/layout";
import SearchPage from "@app/pages/search";
import type { Meta, StoryObj } from "@storybook/react";

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
