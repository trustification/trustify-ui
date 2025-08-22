import * as React from "react";

import {
  Button,
  ButtonVariant,
  InputGroup,
  SearchInput,
  TextInput,
  ToolbarFilter,
} from "@patternfly/react-core";
import SearchIcon from "@patternfly/react-icons/dist/esm/icons/search-icon";

import type { IFilterControlProps } from "./FilterControl";
import type { ISearchFilterCategory } from "./FilterToolbar";

export interface ISearchFilterControlProps<
  TItem,
  TFilterCategoryKey extends string,
> extends IFilterControlProps<TItem, TFilterCategoryKey> {
  category: ISearchFilterCategory<TItem, TFilterCategoryKey>;
  isNumeric: boolean;
}

export const SearchFilterControl = <TItem, TFilterCategoryKey extends string>({
  category,
  filterValue,
  setFilterValue,
  showToolbarItem,
  isNumeric,
  isDisabled = false,
}: React.PropsWithChildren<
  ISearchFilterControlProps<TItem, TFilterCategoryKey>
>): React.JSX.Element | null => {
  // Keep internal copy of value until submitted by user
  const [inputValue, setInputValue] = React.useState(filterValue?.[0] || "");
  // Update it if it changes externally
  React.useEffect(() => {
    setInputValue(filterValue?.[0] || "");
  }, [filterValue]);

  const onFilterSubmit = () => {
    const trimmedValue = inputValue.trim();
    setFilterValue(trimmedValue ? [trimmedValue.replace(/\s+/g, " ")] : []);
  };

  const id = `${category.categoryKey}-input`;

  const inputProps = {
    name: id,
    onChange: (_: React.FormEvent, value: string) => setInputValue(value),
    "aria-label": `${category.title} filter`,
    value: inputValue,
    placeholder: category.placeholderText,
    onKeyDown: (event: React.KeyboardEvent) => {
      if (event.key && event.key !== "Enter") return;
      onFilterSubmit();
    },
    isDisabled: isDisabled,
  };

  return (
    <ToolbarFilter
      labels={filterValue?.map((value) => ({ key: value, node: value })) || []}
      deleteLabel={() => setFilterValue([])}
      categoryName={category.title}
      showToolbarItem={showToolbarItem}
    >
      {isNumeric ? (
        <InputGroup>
          <TextInput type="number" id="search-input" {...inputProps} />
          <Button
            icon={<SearchIcon />}
            variant={ButtonVariant.control}
            id="search-button"
            aria-label="search button for search input"
            onClick={onFilterSubmit}
            isDisabled={isDisabled}
          />
        </InputGroup>
      ) : (
        <SearchInput inputProps={{ id: "search-input" }} {...inputProps} />
      )}
    </ToolbarFilter>
  );
};
