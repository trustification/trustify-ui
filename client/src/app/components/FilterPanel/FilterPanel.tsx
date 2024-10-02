import * as React from "react";

import { Card, CardBody, CardTitle } from "@patternfly/react-core";

import { FilterControl } from "./FilterControl";
import {
  FilterCategory,
  FilterValue,
  IFilterValues,
} from "../FilterToolbar/FilterToolbar";

export interface IFilterPanelProps<TItem, TFilterCategoryKey extends string> {
  filterCategories: FilterCategory<TItem, TFilterCategoryKey>[];
  filterValues: IFilterValues<TFilterCategoryKey>;
  setFilterValues: (values: IFilterValues<TFilterCategoryKey>) => void;
  isDisabled?: boolean;
  ommitFilterCategoryKeys?: TFilterCategoryKey[];
}

export const FilterPanel = <TItem, TFilterCategoryKey extends string>({
  filterCategories,
  filterValues,
  setFilterValues,
  isDisabled = false,
  ommitFilterCategoryKeys = [],
}: React.PropsWithChildren<
  IFilterPanelProps<TItem, TFilterCategoryKey>
>): JSX.Element | null => {
  const setFilterValue = (
    category: FilterCategory<TItem, TFilterCategoryKey>,
    newValue: FilterValue
  ) => setFilterValues({ ...filterValues, [category.categoryKey]: newValue });

  return (
    <>
      {filterCategories
        .filter((filterCategory) => {
          return (
            ommitFilterCategoryKeys.find(
              (categoryKey) => categoryKey === filterCategory.categoryKey
            ) === undefined
          );
        })
        .map((category) => {
          return (
            <Card key={category.categoryKey} isPlain>
              <CardTitle>{category.title}</CardTitle>
              <CardBody>
                <FilterControl<TItem, TFilterCategoryKey>
                  category={category}
                  filterValue={filterValues[category.categoryKey]}
                  setFilterValue={(newValue) =>
                    setFilterValue(category, newValue)
                  }
                  isDisabled={isDisabled}
                  isSidebar
                />
              </CardBody>
            </Card>
          );
        })}
    </>
  );
};
