import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { SBOMVulnerabilities } from "./SbomVulnerabilities";

type SbomVulnerabilitiesPropsAndCustomArgs = React.ComponentProps<
  typeof SBOMVulnerabilities
> & {
  userStory?: string;
};

const meta: Meta<SbomVulnerabilitiesPropsAndCustomArgs> = {
  title: "Components/SbomVulnerabilities",
  component: SBOMVulnerabilities,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const PrimaryState: Story = {
  args: {
    sbomId: "urn:uuid:01932ff3-0fc4-7bf2-8201-5d5e9dc471bd",
  },
};
