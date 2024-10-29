import * as React from "react";

import {
  Button,
  Stack,
  StackItem,
  Text,
  TextContent,
} from "@patternfly/react-core";

import {
  FilterCategory,
  FilterValue,
  IFilterValues,
} from "../FilterToolbar/FilterToolbar";
import { FilterControl } from "./FilterControl";

export interface IFilterPanelProps<TItem, TFilterCategoryKey extends string> {
  filterCategories: FilterCategory<TItem, TFilterCategoryKey>[];
  filterValues: IFilterValues<TFilterCategoryKey>;
  setFilterValues: (values: IFilterValues<TFilterCategoryKey>) => void;
  isDisabled?: boolean;
  omitFilterCategoryKeys?: TFilterCategoryKey[];
}

export const FilterPanel = <TItem, TFilterCategoryKey extends string>({
  filterCategories,
  filterValues,
  setFilterValues,
  isDisabled = false,
  omitFilterCategoryKeys = [],
}: React.PropsWithChildren<
  IFilterPanelProps<TItem, TFilterCategoryKey>
>): JSX.Element | null => {
  const setFilterValue = (
    category: FilterCategory<TItem, TFilterCategoryKey>,
    newValue: FilterValue
  ) => setFilterValues({ ...filterValues, [category.categoryKey]: newValue });

  const clearAllFilters = () => {
    const filtersToBeCleared = filterCategories
      .filter((filterCategory) => {
        return (
          omitFilterCategoryKeys.find(
            (categoryKey) => categoryKey === filterCategory.categoryKey
          ) === undefined
        );
      })
      .reduce((prev, current) => {
        return { ...prev, [current.categoryKey]: undefined };
      }, {});
    setFilterValues({ ...filterValues, ...filtersToBeCleared });
  };

  return (
    <>
      <Stack hasGutter>
        <StackItem>
          <Button variant="link" isInline onClick={clearAllFilters}>
            Clear all filters
          </Button>
        </StackItem>
        {filterCategories
          .filter((filterCategory) => {
            return (
              omitFilterCategoryKeys.find(
                (categoryKey) => categoryKey === filterCategory.categoryKey
              ) === undefined
            );
          })
          .map((category) => {
            return (
              <StackItem key={category.categoryKey}>
                <Stack hasGutter>
                  <StackItem>
                    <TextContent>
                      <Text component="h4">{category.title}</Text>
                    </TextContent>
                  </StackItem>
                  <StackItem>
                    <FilterControl<TItem, TFilterCategoryKey>
                      category={category}
                      filterValue={filterValues[category.categoryKey]}
                      setFilterValue={(newValue) =>
                        setFilterValue(category, newValue)
                      }
                      isDisabled={isDisabled}
                      isSidebar
                    />
                  </StackItem>
                </Stack>
              </StackItem>
            );
          })}
      </Stack>
    </>
  );
};
