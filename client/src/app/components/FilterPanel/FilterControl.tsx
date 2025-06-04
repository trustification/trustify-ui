import type * as React from "react";

import {
  type FilterCategory,
  FilterType,
  type FilterValue,
  type IMultiselectFilterCategory,
  type ISearchFilterCategory,
  type ISelectFilterCategory,
} from "../FilterToolbar";
import { CheckboxFilterControl } from "./CheckboxFilterControl";
import { DateRangeFilter } from "./DateRangeFilter";
import { RadioFilterControl } from "./RadioFilterControl";
import { SearchFilterControl } from "./SearchFilterControl";
import { TypeaheadFilterControl } from "./TypeaheadFilterControl";

export interface IFilterControlProps<TItem, TFilterCategoryKey extends string> {
  category: FilterCategory<TItem, TFilterCategoryKey>;
  filterValue: FilterValue;
  setFilterValue: (newValue: FilterValue) => void;
  isDisabled?: boolean;
  isSidebar?: boolean;
}

export const FilterControl = <TItem, TFilterCategoryKey extends string>({
  category,
  ...props
}: React.PropsWithChildren<
  IFilterControlProps<TItem, TFilterCategoryKey>
>): JSX.Element | null => {
  if (category.type === FilterType.select) {
    return (
      <RadioFilterControl
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
      <CheckboxFilterControl
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
  if (category.type === FilterType.autocompleteServerSide) {
    return (
      <TypeaheadFilterControl
        category={
          category as IMultiselectFilterCategory<TItem, TFilterCategoryKey>
        }
        {...props}
      />
    );
  }
  return null;
};
