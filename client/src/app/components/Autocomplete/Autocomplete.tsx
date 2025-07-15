import type React from "react";
import { useRef } from "react";

import {
  Flex,
  FlexItem,
  Label,
  type LabelProps,
  MenuToggle,
  type MenuToggleElement,
  Select,
  SelectList,
  SelectOption,
} from "@patternfly/react-core";

import { getString } from "@app/utils/utils";

import { LabelToolip } from "../LabelTooltip";
import { SearchInputComponent } from "./SearchInput";
import type { AutocompleteOptionProps } from "./type-utils";
import { useAutocompleteHandlers } from "./useAutocompleteHandlers";

export interface IAutocompleteProps {
  id?: string;
  onChange: (selections: AutocompleteOptionProps[]) => void;
  filterBeforeOnChange?: (
    selections: AutocompleteOptionProps[],
    value: AutocompleteOptionProps,
  ) => AutocompleteOptionProps[];

  /** The set of options to use for selection */
  options?: AutocompleteOptionProps[];
  selections?: AutocompleteOptionProps[];

  placeholderText?: string;
  searchString?: string;
  searchInputAriaLabel?: string;
  labelColor?: LabelProps["color"];
  noResultsMessage?: string;

  showChips?: boolean;
  onSearchChange?: (value: string) => void;
  onCreateNewOption?: (value: string) => AutocompleteOptionProps;
  validateNewOption?: (value: string) => boolean;

  isDisabled?: boolean;
  isScrollable?: boolean;
}

/**
 * Multiple type-ahead with table complete and selection labels
 */
export const Autocomplete: React.FC<IAutocompleteProps> = ({
  id = "",
  onChange,
  filterBeforeOnChange,
  options = [],
  placeholderText = "Search",
  searchString = "",
  searchInputAriaLabel = "Search input",
  labelColor,
  selections = [],
  noResultsMessage,
  showChips,
  onSearchChange,
  onCreateNewOption,
  validateNewOption,
  isDisabled,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const {
    inputValue,
    isDropdownOpen,
    setIsDropdownOpen,
    optionsNotSelected,
    removeSelectionById,
    handleOnSelect,
    handleOnCreateNewOption,
    handleInputChange,
    handleKeyDown,
    handleClearSearchInput,
    handleClickSearchInput,
    handleClickToggle,
    activeItem,
    focusedItemIndex,
  } = useAutocompleteHandlers({
    options,
    searchString,
    selections,
    onChange,
    filterBeforeOnChange,
    menuRef,
    searchInputRef,
    onCreateNewOption,
    validateNewOption,
    onSearchChange,
  });

  const createItemId = (value: string) =>
    `select-typeahead-${value.replace(" ", "-")}`;

  const inputGroup = (
    <SearchInputComponent
      id={id}
      placeholder={placeholderText}
      ariaLabel={searchInputAriaLabel}
      onSearchChange={handleInputChange}
      onClear={handleClearSearchInput}
      onKeyHandling={handleKeyDown}
      onClick={handleClickSearchInput}
      inputValue={inputValue}
      inputRef={searchInputRef}
      options={options}
      isDropdownOpen={isDropdownOpen}
      activeItem={activeItem}
    />
  );

  const toggle = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      ref={toggleRef}
      variant="typeahead"
      onClick={handleClickToggle}
      isExpanded={isDropdownOpen}
      isDisabled={isDisabled}
      isFullWidth
      status={
        inputValue && validateNewOption
          ? !validateNewOption(inputValue)
            ? "danger"
            : undefined
          : undefined
      }
    >
      {inputGroup}
    </MenuToggle>
  );

  return (
    <Flex direction={{ default: "column" }}>
      <FlexItem key="input">
        <Select
          isOpen={
            isDropdownOpen &&
            (optionsNotSelected.length > 0 ||
              !!noResultsMessage ||
              (!!onCreateNewOption && inputValue.length > 0))
          }
          selected={selections}
          onOpenChange={setIsDropdownOpen}
          toggle={toggle}
          variant="typeahead"
        >
          <SelectList id="select-create-typeahead-listbox">
            {onCreateNewOption && optionsNotSelected.length === 0 ? (
              <SelectOption
                id={createItemId("new-option")}
                isFocused={true}
                onClick={() => handleOnCreateNewOption(inputValue)}
              >{`Create new option "${inputValue}"`}</SelectOption>
            ) : noResultsMessage && optionsNotSelected.length === 0 ? (
              <SelectOption isAriaDisabled>{noResultsMessage}</SelectOption>
            ) : (
              optionsNotSelected.map((option, index) => (
                <SelectOption
                  key={option.id}
                  id={createItemId(option.id)}
                  isFocused={focusedItemIndex === index}
                  ref={null}
                  onClick={() => handleOnSelect(option)}
                  {...option.optionProps}
                >
                  {getString(option.name)}
                </SelectOption>
              ))
            )}
          </SelectList>
        </Select>
      </FlexItem>
      {showChips && (
        <FlexItem key="chips">
          <Flex spaceItems={{ default: "spaceItemsXs" }}>
            {selections.map((option) => (
              <FlexItem key={option.id}>
                <LabelToolip content={option.tooltip}>
                  <Label
                    color={labelColor}
                    onClose={() => removeSelectionById(option.id)}
                  >
                    {getString(option.labelName || option.name)}
                  </Label>
                </LabelToolip>
              </FlexItem>
            ))}
          </Flex>
        </FlexItem>
      )}
    </Flex>
  );
};
