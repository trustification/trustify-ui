import * as React from "react";

import { FilterControl } from "./FilterControl";
import {
  FilterCategory,
  FilterValue,
  IFilterToolbarProps,
} from "./FilterToolbar";
import { Card, CardBody, CardTitle } from "@patternfly/react-core";

export const FilterSidePanel = <TItem, TFilterCategoryKey extends string>({
  filterCategories,
  filterValues,
  setFilterValues,
  isDisabled = false,
  ommitFilterCategoryKeys = [],
}: React.PropsWithChildren<IFilterToolbarProps<TItem, TFilterCategoryKey>> & {
  ommitFilterCategoryKeys?: string[];
}): JSX.Element | null => {
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
                  showToolbarItem={true}
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
