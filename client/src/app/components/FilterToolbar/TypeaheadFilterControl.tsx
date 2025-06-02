import * as React from "react";

import { ToolbarFilter, type ToolbarLabel } from "@patternfly/react-core";

import { getString } from "@app/utils/utils";
import { Autocomplete } from "../Autocomplete/Autocomplete";
import type { GroupedAutocompleteOptionProps } from "../Autocomplete/type-utils";
import type { IFilterControlProps } from "./FilterControl";
import type {
  FilterSelectOptionProps,
  IMultiselectFilterCategory,
} from "./FilterToolbar";

export interface ITypeaheadFilterControlProps<TItem>
  extends IFilterControlProps<TItem, string> {
  category: IMultiselectFilterCategory<TItem, string>;
  isScrollable?: boolean;
}

export const TypeaheadFilterControl = <TItem,>({
  category,
  filterValue,
  setFilterValue,
  showToolbarItem,
  isDisabled = false,
}: React.PropsWithChildren<
  ITypeaheadFilterControlProps<TItem>
>): JSX.Element | null => {
  const optionMap = React.useRef(
    new Map<string, FilterSelectOptionProps | null>(),
  );

  const [selectOptions, setSelectOptions] = React.useState<
    FilterSelectOptionProps[]
  >(Array.isArray(category.selectOptions) ? category.selectOptions : []);

  React.useEffect(() => {
    setSelectOptions(
      Array.isArray(category.selectOptions) ? category.selectOptions : [],
    );
  }, [category.selectOptions]);

  const onFilterClearAll = () => setFilterValue([]);
  const onFilterClear = (chip: string | ToolbarLabel) => {
    const value = typeof chip === "string" ? chip : chip.key;

    if (value) {
      const newValue = filterValue?.filter((val) => val !== value) ?? [];
      setFilterValue(newValue.length > 0 ? newValue : null);
    }
  };

  const getOptionFromOptionValue = (optionValue: string) => {
    return optionMap.current.get(optionValue);
  };

  const chips = filterValue?.map((value) => {
    const option = getOptionFromOptionValue(value);
    const { chipLabel, label } = option ?? {};
    return {
      key: value,
      node: chipLabel ?? label ?? value,
    };
  });

  return (
    <ToolbarFilter
      id={`filter-control-${category.categoryKey}`}
      labels={chips}
      deleteLabel={(_, chip) => onFilterClear(chip as string)}
      deleteLabelGroup={onFilterClearAll}
      categoryName={category.title}
      showToolbarItem={showToolbarItem}
    >
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
          const newFilterValue = selections.map((option) => {
            return getString(option.name);
          });
          setFilterValue(newFilterValue);
        }}
        noResultsMessage="No search results"
        placeholderText={category.placeholderText}
        searchInputAriaLabel="select-autocomplete-listbox"
        onSearchChange={category.onInputValueChange}
      />
    </ToolbarFilter>
  );
};
