import * as React from "react";

import {
  FilterCategory,
  FilterType,
  FilterValue,
  IMultiselectFilterCategory,
  ISearchFilterCategory,
  ISelectFilterCategory,
} from "../FilterToolbar";
import { SearchFilterControl } from "./SearchFilterControl";
import { RadioFilterControl } from "./RadioFilterControl";
import { CheckboxFilterControl } from "./CheckboxFilterControl";
import { DateRangeFilter } from "./DateRangeFilter";

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
  return null;
};
