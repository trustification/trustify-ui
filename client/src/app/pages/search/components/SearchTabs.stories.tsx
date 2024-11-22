import React from "react";

import type { Meta, StoryObj } from "@storybook/react";
import { SearchTabs } from "./SearchTabs";
import { AxiosError } from "axios";

type StoryArgs = {
  fetchError?: AxiosError<unknown, any>;
  isFetching?: boolean;
  vulnerabilityId: string;
};

const meta: Meta<typeof SearchTabs> = {
  title: "Components/Search/SearchTabs",
  component: SearchTabs,
};

export default meta;

type Story = StoryObj<StoryArgs>;

export const DefaultState: Story = {};

export const ErrorState: Story = {};
