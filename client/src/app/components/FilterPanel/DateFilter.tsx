import React, { type FormEvent, useState } from "react";

import { DatePicker, Form, FormGroup } from "@patternfly/react-core";

import {
  americanDateFormat,
  isValidAmericanShortDate,
  parseAmericanDate,
} from "../FilterToolbar/dateUtils";
import type { IFilterControlProps } from "./FilterControl";

export const DateFilter = <TItem,>({
  filterValue,
  setFilterValue,
  isDisabled = false,
}: React.PropsWithChildren<
  IFilterControlProps<TItem, string>
>): React.JSX.Element | null => {
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
    <Form>
      <FormGroup role="group" isInline>
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
      </FormGroup>
    </Form>
  );
};
