import * as React from "react";

import { getString } from "@app/utils/utils";
import { Autocomplete } from "../Autocomplete/Autocomplete";
import type { GroupedAutocompleteOptionProps } from "../Autocomplete/type-utils";
import type {
  FilterSelectOptionProps,
  IMultiselectFilterCategory,
} from "../FilterToolbar";
import type { IFilterControlProps } from "./FilterControl";

export interface ITypeaheadFilterControlProps<TItem>
  extends IFilterControlProps<TItem, string> {
  category: IMultiselectFilterCategory<TItem, string>;
  isScrollable?: boolean;
}

export const TypeaheadFilterControl = <TItem,>({
  category,
  filterValue,
  setFilterValue,
  isDisabled = false,
  isScrollable,
}: React.PropsWithChildren<
  ITypeaheadFilterControlProps<TItem>
>): JSX.Element | null => {
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
      isInputText
      selections={filterValue?.map((value) => {
        const option: GroupedAutocompleteOptionProps = {
          uniqueId: value,
          name: value,
        };
        return option;
      })}
      options={selectOptions.map((option) => ({
        uniqueId: option.value,
        name: option.label ?? option.value,
      }))}
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
