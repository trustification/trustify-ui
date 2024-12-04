import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Route, Routes } from "react-router";
import Home from "@app/pages/home";
import { NotificationsProvider } from "@app/components/NotificationsContext";
import { DefaultLayout } from "@app/layout";

import {
  Title,
  Subtitle,
  Description,
  Primary,
  Controls,
  Stories,
} from "@storybook/blocks";

interface IProductExplorer {
  id: string;
  name: string;
  vendor?: any;
  versions?: [];
}

const ProductExplorer: React.FC<IProductExplorer> = (product) => {
  return <>Product Explorer: {product.id}</>;
};

const meta = {
  title: "v2.1/Product Explorer",
  component: ProductExplorer,
  decorators: [
    (Story) => (
      <NotificationsProvider>
        <DefaultLayout>
          <Routes>
            <Route path="/products/:productId" element={<Story />} />
          </Routes>
        </DefaultLayout>
      </NotificationsProvider>
    ),
  ],
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description />
          <Primary />
          <Controls />
          <Stories />
        </>
      ),
    },
  },
} satisfies Meta<typeof Home>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PrimaryState: Story = {
  args: {
    id: "urn:uuid:2e167215-42ec-4a71-912c-73082c21cf57",
    name: "A name",
  },
  // params: {
  //   productId: "urn:uuid:2e167215-42ec-4a71-912c-73082c21cf57",
  // },
};
