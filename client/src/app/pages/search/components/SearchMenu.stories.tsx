import type { Meta, StoryObj } from "@storybook/react";
import { IEntity, SearchMenu } from "./SearchMenu";
import { Label, MenuItem } from "@patternfly/react-core";
import React from "react";

const meta = {
  title: "Components/Search/SearchMenu",
  component: SearchMenu,
  tags: ["autodocs"],
} satisfies Meta<typeof SearchMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

function customFilterIncludes(list: IEntity[], searchString: string) {
  let options: React.JSX.Element[] = list
    .filter(
      (option) =>
        option.id.toLowerCase().includes(searchString.toLowerCase()) ||
        option.title?.toLowerCase().includes(searchString.toLowerCase()) ||
        option.description?.toLowerCase().includes(searchString.toLowerCase())
    )
    .map((option) => (
      <MenuItem
        itemId={option.id}
        key={option.id}
        description={option.description}
        to={option.navLink}
      >
        {option.title} <Label color={option.typeColor}>{option.type}</Label>
      </MenuItem>
    ));

  if (options.length > 10) {
    options = options.slice(0, 10);
  } else {
    options = [
      ...options,
      ...list
        .filter(
          (option: IEntity) =>
            !option.id.startsWith(searchString.toLowerCase()) &&
            option.id.includes(searchString.toLowerCase())
        )
        .map((option: IEntity) => (
          <MenuItem
            itemId={option.id}
            key={option.id}
            description={option.description}
            to={option.navLink}
          >
            {option.title} <Label color={option.typeColor}>{option.type}</Label>
          </MenuItem>
        )),
    ].slice(0, 10);
  }

  return options;
}

export const DefaultState: Story = {
  args: {
    onChangeSearch: jest.fn(),
  },
};

export const WithCustomFilter: Story = {
  args: {
    filterFunction: customFilterIncludes,
    onChangeSearch: jest.fn(),
  },
};
