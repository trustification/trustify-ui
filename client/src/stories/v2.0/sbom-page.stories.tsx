import type { Meta, StoryObj } from "@storybook/react";
import { SbomList } from "@app/pages/sbom-list/sbom-list";

const meta = {
  title: "v2.0/SBOMs/SBOM List",
  component: SbomList,
} satisfies Meta<typeof SbomList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PrimaryState: Story = {};
