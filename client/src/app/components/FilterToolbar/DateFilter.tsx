import React, { type FormEvent, useState } from "react";

import { DatePicker, InputGroup, ToolbarFilter } from "@patternfly/react-core";

import type { IFilterControlProps } from "./FilterControl";
import {
  americanDateFormat,
  isValidAmericanShortDate,
  parseAmericanDate,
} from "./dateUtils";

export const DateFilter = <TItem,>({
  category,
  filterValue,
  setFilterValue,
  showToolbarItem,
  isDisabled = false,
}: React.PropsWithChildren<
  IFilterControlProps<TItem, string>
>): React.JSX.Element | null => {
  const selectedFilters = filterValue ?? [];
  const validFilters =
    selectedFilters?.filter((value) => isValidAmericanShortDate(value)) ?? [];

  const [date, setDate] = useState<Date>();

  // Update it if it changes externally
  React.useEffect(() => {
    if (filterValue?.[0]) {
      const date = parseAmericanDate(filterValue?.[0]);
      setDate(date);
    } else {
      setDate(undefined);
    }
  }, [filterValue]);

  const onDateChange = (_event: FormEvent<HTMLInputElement>, value: string) => {
    if (isValidAmericanShortDate(value)) {
      const newDate = parseAmericanDate(value);
      setDate(newDate);
      const target = americanDateFormat(newDate);
      if (target) {
        setFilterValue([target]);
      }
    }
  };

  return (
    <ToolbarFilter
      key={category.categoryKey}
      labels={validFilters.map((value) => ({
        key: value,
        node: value,
      }))}
      deleteLabel={() => setFilterValue([])}
      categoryName={category.title}
      showToolbarItem={showToolbarItem}
    >
      <InputGroup>
        <DatePicker
          value={date ? americanDateFormat(date) : ""}
          dateFormat={americanDateFormat}
          dateParse={parseAmericanDate}
          onChange={onDateChange}
          aria-label="Date"
          placeholder="MM/DD/YYYY"
          // disable error text (no space in toolbar scenario)
          invalidFormatText={""}
          // default value ("parent") creates collision with sticky table header
          appendTo={document.body}
          isDisabled={isDisabled}
        />
      </InputGroup>
    </ToolbarFilter>
  );
};
