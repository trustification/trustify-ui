import * as React from "react";

import {
  Badge,
  Button,
  MenuToggle,
  type MenuToggleElement,
  Select,
  SelectList,
  SelectOption,
  TextInputGroup,
  TextInputGroupMain,
  TextInputGroupUtilities,
} from "@patternfly/react-core";
import TimesIcon from "@patternfly/react-icons/dist/esm/icons/times-icon";
import { css } from "@patternfly/react-styles";

import type {
  FilterSelectOptionProps,
  IMultiselectFilterCategory,
} from "../FilterToolbar";
import type { IFilterControlProps } from "./FilterControl";

const defaultDebounce = 500;

export interface ITypeaheadFilterControlProps<TItem>
  extends IFilterControlProps<TItem, string> {
  category: IMultiselectFilterCategory<TItem, string>;
  isScrollable?: boolean;
}

export const TypeaheadFilterControl = <TItem,>({
  category,
  filterValue,
  setFilterValue,
  isDisabled = false,
  isScrollable,
}: React.PropsWithChildren<
  ITypeaheadFilterControlProps<TItem>
>): JSX.Element | null => {
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = React.useState(false);

  const optionMap = React.useRef(
    new Map<string, FilterSelectOptionProps | null>(),
  );

  const [selectOptions, setSelectOptions] = React.useState<
    FilterSelectOptionProps[]
  >(Array.isArray(category.selectOptions) ? category.selectOptions : []);

  React.useEffect(() => {
    setSelectOptions(
      Array.isArray(category.selectOptions) ? category.selectOptions : [],
    );
  }, [category.selectOptions]);

  const [focusedItemIndex, setFocusedItemIndex] = React.useState<number | null>(
    null,
  );

  const [activeItem, setActiveItem] = React.useState<string | null>(null);
  const textInputRef = React.useRef<HTMLInputElement>(undefined);
  const [inputValue, setInputValue] = React.useState<string>("");

  React.useEffect(() => {
    const delayInputTimeoutId = setTimeout(() => {
      if (category.onDebouncedInputValue) {
        category.onDebouncedInputValue(inputValue);
      }
    }, defaultDebounce);
    return () => clearTimeout(delayInputTimeoutId);
  }, [inputValue, category.onDebouncedInputValue]);

  const onSelect = (value: string | undefined) => {
    if (value) {
      // Save Option Props as Typeahead will replace the SelectList as
      // the user types
      const selectedOption = selectOptions.find((e) => e.value === value);
      optionMap.current.set(value, selectedOption ?? null);

      // Update Filter
      let newFilterValue: string[];
      if (filterValue?.includes(value)) {
        newFilterValue = filterValue.filter((item) => item !== value);
      } else {
        newFilterValue = filterValue ? [...filterValue, value] : [value];
      }

      setFilterValue(newFilterValue);
    }
    textInputRef.current?.focus();
  };

  const onTextInputChange = (
    _event: React.FormEvent<HTMLInputElement>,
    value: string,
  ) => {
    setInputValue(value);
    if (!isFilterDropdownOpen) {
      setIsFilterDropdownOpen(true);
    }
  };

  const handleMenuArrowKeys = (key: string) => {
    let indexToFocus = 0;

    if (isFilterDropdownOpen) {
      if (key === "ArrowUp") {
        if (focusedItemIndex === null || focusedItemIndex === 0) {
          indexToFocus = selectOptions.length - 1;
        } else {
          indexToFocus = focusedItemIndex - 1;
        }
      }

      if (key === "ArrowDown") {
        if (
          focusedItemIndex === null ||
          focusedItemIndex === selectOptions.length - 1
        ) {
          indexToFocus = 0;
        } else {
          indexToFocus = focusedItemIndex + 1;
        }
      }
    }

    setFocusedItemIndex(indexToFocus);
    const focusedItem = selectOptions.filter(
      ({ optionProps }) => !optionProps?.isDisabled,
    )[indexToFocus];
    setActiveItem(
      `select-multi-typeahead-checkbox-${focusedItem.value.replace(" ", "-")}`,
    );
  };

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const enabledMenuItems = Array.isArray(selectOptions)
      ? selectOptions.filter(({ optionProps }) => !optionProps?.isDisabled)
      : [];
    const [firstMenuItem] = enabledMenuItems;
    const focusedItem = focusedItemIndex
      ? enabledMenuItems[focusedItemIndex]
      : firstMenuItem;

    const newSelectOptions = selectOptions.filter((menuItem) =>
      menuItem.value.toLowerCase().includes(inputValue.toLowerCase()),
    );
    const selectedItem =
      newSelectOptions.find(
        (option) => option.value.toLowerCase() === inputValue.toLowerCase(),
      ) || focusedItem;

    switch (event.key) {
      case "Enter":
        if (!isFilterDropdownOpen) {
          setIsFilterDropdownOpen((prev) => !prev);
        } else if (selectedItem && selectedItem.value !== "No results") {
          onSelect(selectedItem.value);
        }
        break;
      case "Tab":
      case "Escape":
        setIsFilterDropdownOpen(false);
        setActiveItem(null);
        break;
      case "ArrowUp":
      case "ArrowDown":
        event.preventDefault();
        handleMenuArrowKeys(event.key);
        break;
      default:
        break;
    }
  };

  const toggle = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      ref={toggleRef}
      variant="typeahead"
      onClick={() => {
        setIsFilterDropdownOpen(!isFilterDropdownOpen);
      }}
      isExpanded={isFilterDropdownOpen}
      isDisabled={isDisabled}
      isFullWidth
    >
      <TextInputGroup isPlain>
        <TextInputGroupMain
          value={inputValue}
          onClick={() => {
            setIsFilterDropdownOpen(!isFilterDropdownOpen);
          }}
          onChange={onTextInputChange}
          onKeyDown={onInputKeyDown}
          id="typeahead-select-input"
          autoComplete="off"
          innerRef={textInputRef}
          placeholder={category.placeholderText}
          {...(activeItem && { "aria-activedescendant": activeItem })}
          role="combobox"
          isExpanded={isFilterDropdownOpen}
          aria-controls="select-typeahead-listbox"
        />

        <TextInputGroupUtilities>
          {!!inputValue && (
            <Button
              icon={<TimesIcon aria-hidden />}
              variant="plain"
              onClick={() => {
                setInputValue("");
                textInputRef?.current?.focus();
              }}
              aria-label="Clear input value"
            />
          )}
          {filterValue?.length ? (
            <Badge isRead>{filterValue.length}</Badge>
          ) : null}
        </TextInputGroupUtilities>
      </TextInputGroup>
    </MenuToggle>
  );

  return (
    <Select
      className={css(isScrollable && "isScrollable")}
      aria-label={category.title}
      toggle={toggle}
      selected={filterValue}
      onOpenChange={(isOpen) => setIsFilterDropdownOpen(isOpen)}
      onSelect={(_, selection) => onSelect(selection as string)}
      isOpen={isFilterDropdownOpen}
      variant="typeahead"
    >
      <SelectList id="select-create-typeahead-listbox">
        {selectOptions.map(({ label, value, optionProps }, index) => {
          return (
            <SelectOption
              {...optionProps}
              {...(!optionProps?.isDisabled && { hasCheckbox: true })}
              key={value}
              value={value}
              isFocused={focusedItemIndex === index}
              isSelected={filterValue?.includes(value)}
            >
              {label ?? value}
            </SelectOption>
          );
        })}
      </SelectList>
    </Select>
  );
};
