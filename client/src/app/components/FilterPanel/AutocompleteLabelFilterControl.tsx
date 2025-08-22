import * as React from "react";

import { getString } from "@app/utils/utils";

import { Autocomplete } from "../Autocomplete/Autocomplete";
import type { AutocompleteOptionProps } from "../Autocomplete/type-utils";
import type {
  FilterSelectOptionProps,
  IMultiselectFilterCategory,
} from "../FilterToolbar";
import type { IFilterControlProps } from "./FilterControl";

export interface IAutocompleteLabelFilterControlProps<TItem>
  extends IFilterControlProps<TItem, string> {
  category: IMultiselectFilterCategory<TItem, string>;
}

export const AutocompleteLabelFilterControl = <TItem,>({
  category,
  filterValue,
  setFilterValue,
  isDisabled = false,
}: React.PropsWithChildren<
  IAutocompleteLabelFilterControlProps<TItem>
>): React.JSX.Element | null => {
  const [selectOptions, setSelectOptions] = React.useState<
    FilterSelectOptionProps[]
  >(Array.isArray(category.selectOptions) ? category.selectOptions : []);

  React.useEffect(() => {
    setSelectOptions(
      Array.isArray(category.selectOptions) ? category.selectOptions : [],
    );
  }, [category.selectOptions]);

  return (
    <Autocomplete
      showChips
      isDisabled={isDisabled}
      options={selectOptions.map((option) => ({
        id: option.value,
        name: option.label ?? option.value,
      }))}
      selections={filterValue?.map((value) => {
        const option: AutocompleteOptionProps = {
          id: value,
          name: value,
        };
        return option;
      })}
      onChange={(selections) => {
        const newFilterValue = selections.map((option) =>
          getString(option.name),
        );
        setFilterValue(newFilterValue);
      }}
      noResultsMessage="No search results"
      placeholderText={category.placeholderText}
      searchInputAriaLabel="select-autocomplete-listbox"
      onSearchChange={category.onInputValueChange}
    />
  );
};
