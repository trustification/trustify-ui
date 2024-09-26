import * as React from "react";

import { Radio } from "@patternfly/react-core";

import { ISelectFilterCategory } from "../FilterToolbar";
import { IFilterControlProps } from "./FilterControl";

export interface ISelectFilterControlProps<
  TItem,
  TFilterCategoryKey extends string,
> extends IFilterControlProps<TItem, TFilterCategoryKey> {
  category: ISelectFilterCategory<TItem, TFilterCategoryKey>;
}

export const RadioFilterControl = <TItem, TFilterCategoryKey extends string>({
  category,
  filterValue,
  setFilterValue,
  isDisabled = false,
}: React.PropsWithChildren<
  ISelectFilterControlProps<TItem, TFilterCategoryKey>
>): JSX.Element | null => {
  const getOptionFromOptionValue = (optionValue: string) =>
    category.selectOptions.find(({ value }) => value === optionValue);

  const onFilterSelect = (value: string) => {
    const option = getOptionFromOptionValue(value);
    setFilterValue(option ? [value] : null);
  };

  return (
    <>
      {category.selectOptions.map(
        ({ label, value, optionProps = {} }, index) => {
          const isSelected = filterValue?.includes(value) || false;
          return (
            <Radio
              isDisabled={isDisabled}
              key={index}
              id={`radio-${index}`}
              name="radio"
              isLabelWrapped
              label={label}
              isChecked={isSelected}
              onChange={() => {
                onFilterSelect(value as string);
              }}
            />
          );
        }
      )}
    </>
  );
};
