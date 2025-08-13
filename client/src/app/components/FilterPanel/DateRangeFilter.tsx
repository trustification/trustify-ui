import React, { type FormEvent, useState } from "react";

import {
  DatePicker,
  Form,
  FormGroup,
  isValidDate as isValidJSDate,
} from "@patternfly/react-core";

import {
  americanDateFormat,
  isValidAmericanShortDate,
  parseAmericanDate,
  parseInterval,
  toISODateInterval,
} from "../FilterToolbar/dateUtils";
import type { IFilterControlProps } from "./FilterControl";

/**
 * This Filter type enables selecting an closed date range.
 * Precisely given range [A,B] a date X in the range if A <= X <= B.
 *
 * **Props are interpreted as follows**:<br>
 * 1) filterValue - date range encoded as ISO 8601 time interval string ("dateFrom/dateTo"). Only date part is used (no time).<br>
 * 2) setFilterValue - accepts the list of ranges.<br>
 *
 */

export const DateRangeFilter = <TItem,>({
  filterValue,
  setFilterValue,
  isDisabled = false,
}: React.PropsWithChildren<
  IFilterControlProps<TItem, string>
>): React.JSX.Element | null => {
  const [from, setFrom] = useState<Date>();
  const [to, setTo] = useState<Date>();

  // Update it if it changes externally
  React.useEffect(() => {
    if (filterValue?.[0]) {
      const [from, to] = parseInterval(filterValue?.[0]);
      setFrom(from.toDate());
      setTo(to.toDate());
    } else {
      setFrom(undefined);
      setTo(undefined);
    }
  }, [filterValue]);

  const onFromDateChange = (
    _event: FormEvent<HTMLInputElement>,
    value: string,
  ) => {
    if (isValidAmericanShortDate(value)) {
      setFrom(parseAmericanDate(value));
      setTo(undefined);
    }
  };

  const onToDateChange = (
    _event: FormEvent<HTMLInputElement>,
    value: string,
  ) => {
    if (isValidAmericanShortDate(value)) {
      const newTo = parseAmericanDate(value);
      setTo(newTo);
      const target = toISODateInterval(from, newTo);
      if (target) {
        setFilterValue([target]);
      }
    }
  };

  return (
    <Form>
      <FormGroup role="group" isInline label="From">
        <DatePicker
          value={from ? americanDateFormat(from) : ""}
          dateFormat={americanDateFormat}
          dateParse={parseAmericanDate}
          onChange={onFromDateChange}
          aria-label="Interval start"
          placeholder="MM/DD/YYYY"
          // disable error text (no space in toolbar scenario)
          invalidFormatText={""}
          // default value ("parent") creates collision with sticky table header
          appendTo={document.body}
          isDisabled={isDisabled}
        />
      </FormGroup>
      <FormGroup role="group" isInline label="To">
        <DatePicker
          value={to ? americanDateFormat(to) : ""}
          onChange={onToDateChange}
          isDisabled={isDisabled || !isValidJSDate(from)}
          dateFormat={americanDateFormat}
          dateParse={parseAmericanDate}
          // disable error text (no space in toolbar scenario)
          invalidFormatText={""}
          rangeStart={from}
          aria-label="Interval end"
          placeholder="MM/DD/YYYY"
          appendTo={document.body}
        />
      </FormGroup>
    </Form>
  );
};
