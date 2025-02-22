import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import {
  Title,
  Subtitle,
  Description,
  Primary,
  Controls,
  Stories,
} from "@storybook/blocks";
import { ProductDetails } from "@app/client";

interface IProductExplorer {
  product: ProductDetails;
}

const ProductExplorer: React.FC<IProductExplorer> = ({ product }) => {
  return (
    <>
      <p>Product Explorer: {product.id}</p>
    </>
  );
};

type ProductExplorerPropsAndCustomArgs = React.ComponentProps<
  typeof ProductExplorer
> & { userStory?: string };

const meta: Meta<ProductExplorerPropsAndCustomArgs> = {
  title: "v2.1/Product Explorer",
  component: ProductExplorer,
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
};

export default meta;
type Story = StoryObj<typeof meta>;

export const PrimaryState: Story = {
  args: {
    product: {
      id: "urn:uuid:2e167215-42ec-4a71-912c-73082c21cf57",
      name: "RH Trusted Artifact Signer",
      vendor: {
        cpe_key: "example",
        id: "red-hat",
        name: "Red Hat",
        website: "https://www.redhat.com",
      },
      versions: [],
    },
    userStory:
      "As a developer I want to view all the information about a Product.",
  },
};
