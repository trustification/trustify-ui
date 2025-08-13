import React, { type FormEvent, useState } from "react";

import {
  DatePicker,
  InputGroup,
  ToolbarFilter,
  type ToolbarLabel,
  type ToolbarLabelGroup,
  Tooltip,
  isValidDate as isValidJSDate,
} from "@patternfly/react-core";

import type { IFilterControlProps } from "./FilterControl";
import {
  americanDateFormat,
  isValidAmericanShortDate,
  isValidInterval,
  localizeInterval,
  parseAmericanDate,
  parseInterval,
  toISODateInterval,
} from "./dateUtils";

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
    selectedFilters?.filter((interval) =>
      isValidInterval(parseInterval(interval)),
    ) ?? [];
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

  const rangeToOption = (range: string) => {
    const [, fullRange] = localizeInterval(range);
    const [from, to] = fullRange.split("-");
    return [
      {
        key: `${range}-from`,
        node: (
          <Tooltip content={from ?? range}>
            <span>{from ?? ""}</span>
          </Tooltip>
        ),
      },
      {
        key: `${range}-to`,
        node: (
          <Tooltip content={to ?? range}>
            <span>{to ?? ""}</span>
          </Tooltip>
        ),
      },
    ];
  };

  const clearSingleRange = (
    _category: string | ToolbarLabelGroup,
    _option: string | ToolbarLabel,
  ) => {
    setFilterValue([]);
  };

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
    <ToolbarFilter
      key={category.categoryKey}
      labels={validFilters.flatMap(rangeToOption)}
      deleteLabel={clearSingleRange}
      deleteLabelGroup={() => setFilterValue([])}
      categoryName={category.title}
      showToolbarItem={showToolbarItem}
    >
      <InputGroup>
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
      </InputGroup>
    </ToolbarFilter>
  );
};
