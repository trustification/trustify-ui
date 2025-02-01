import type { Meta, StoryObj } from "@storybook/react";
import { HeaderApp } from "@app/layout/header";
import { fn } from "@storybook/test";
import * as actual from "@app/hooks/useBranding";

const useBranding = fn(actual.useBranding).mockName("useBranding");

import { BrandingStrings } from "@trustify-ui/common";

const meta = {
  title: "Components/Layout/HeaderApp",
  component: HeaderApp,
} satisfies Meta<typeof HeaderApp>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockBrandingStrings: BrandingStrings = {
  application: {
    title: "Mock Trustify",
    name: "Mock App",
    description: "A description of the mock application.",
  },
  about: {
    displayName: "Mock Trustify Display Name",
    imageSrc: "/branding/images/masthead-logo.svg",
    documentationUrl: "https://mock-docs.example.com",
  },
  masthead: {
    leftBrand: {
      src: "/mock-left-brand.svg",
      alt: "Mock Left Brand",
      height: "40px",
    },
    leftTitle: {
      text: "Mock Left Title",
      heading: "h1",
      size: "xl",
    },
    rightBrand: {
      src: "/mock-right-brand.svg",
      alt: "Mock Right Brand",
      height: "40px",
    },
  },
};

export const Primary: Story = {
  args: {
    rightBrand: {},
  },
  async beforeEach() {
    useBranding.mockImplementation(() => mockBrandingStrings);
  },
};
