import type * as React from "react";

import { AutocompleteLabelFilterControl } from "./AutocompleteLabelFilterControl";
import { DateRangeFilter } from "./DateRangeFilter";
import {
  type FilterCategory,
  FilterType,
  type FilterValue,
  type IMultiselectFilterCategory,
  type ISearchFilterCategory,
  type ISelectFilterCategory,
} from "./FilterToolbar";
import { MultiselectFilterControl } from "./MultiselectFilterControl";
import { SearchFilterControl } from "./SearchFilterControl";
import { SelectFilterControl } from "./SelectFilterControl";

export interface IFilterControlProps<TItem, TFilterCategoryKey extends string> {
  category: FilterCategory<TItem, TFilterCategoryKey>;
  filterValue: FilterValue;
  setFilterValue: (newValue: FilterValue) => void;
  showToolbarItem: boolean;
  isDisabled?: boolean;
}

export const FilterControl = <TItem, TFilterCategoryKey extends string>({
  category,
  ...props
}: React.PropsWithChildren<
  IFilterControlProps<TItem, TFilterCategoryKey>
>): React.JSX.Element | null => {
  if (category.type === FilterType.select) {
    return (
      <SelectFilterControl
        isScrollable
        category={category as ISelectFilterCategory<TItem, TFilterCategoryKey>}
        {...props}
      />
    );
  }
  if (
    category.type === FilterType.search ||
    category.type === FilterType.numsearch
  ) {
    return (
      <SearchFilterControl
        category={category as ISearchFilterCategory<TItem, TFilterCategoryKey>}
        isNumeric={category.type === FilterType.numsearch}
        {...props}
      />
    );
  }
  if (category.type === FilterType.multiselect) {
    return (
      <MultiselectFilterControl
        isScrollable
        category={
          category as IMultiselectFilterCategory<TItem, TFilterCategoryKey>
        }
        {...props}
      />
    );
  }
  if (category.type === FilterType.dateRange) {
    return <DateRangeFilter category={category} {...props} />;
  }
  if (category.type === FilterType.autocompleteLabel) {
    return (
      <AutocompleteLabelFilterControl
        category={
          category as IMultiselectFilterCategory<TItem, TFilterCategoryKey>
        }
        {...props}
      />
    );
  }
  return null;
};
