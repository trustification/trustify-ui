import * as React from "react";

import { Checkbox } from "@patternfly/react-core";

import {
  FilterSelectOptionProps,
  IMultiselectFilterCategory,
} from "../FilterToolbar";
import { IFilterControlProps } from "./FilterControl";

export interface IMultiselectFilterControlProps<TItem>
  extends IFilterControlProps<TItem, string> {
  category: IMultiselectFilterCategory<TItem, string>;
}

export const CheckboxFilterControl = <TItem,>({
  category,
  filterValue,
  setFilterValue,
  isDisabled = false,
}: React.PropsWithChildren<
  IMultiselectFilterControlProps<TItem>
>): JSX.Element | null => {
  const [selectOptions, setSelectOptions] = React.useState<
    FilterSelectOptionProps[]
  >(Array.isArray(category.selectOptions) ? category.selectOptions : []);

  React.useEffect(() => {
    setSelectOptions(
      Array.isArray(category.selectOptions) ? category.selectOptions : []
    );
  }, [category.selectOptions]);

  const hasGroupings = !Array.isArray(selectOptions);

  const flatOptions: FilterSelectOptionProps[] = !hasGroupings
    ? selectOptions
    : (Object.values(selectOptions).flatMap(
        (i) => i
      ) as FilterSelectOptionProps[]);

  const onSelect = (value: string | undefined) => {
    if (value && value !== "No results") {
      let newFilterValue: string[];

      if (filterValue && filterValue.includes(value)) {
        newFilterValue = filterValue.filter((item) => item !== value);
      } else {
        newFilterValue = filterValue ? [...filterValue, value] : [value];
      }

      setFilterValue(newFilterValue);
    }
  };

  return (
    <>
      {flatOptions.map(({ label, value, optionProps = {} }, index) => {
        return (
          <Checkbox
            key={index}
            id={`checkbox-${index}-${category.categoryKey}`}
            isLabelWrapped
            label={label}
            isChecked={filterValue?.includes(value)}
            onChange={() => {
              onSelect(value);
            }}
          />
        );
      })}
    </>
  );
};
