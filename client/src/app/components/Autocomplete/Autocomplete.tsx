import React, { useRef } from "react";

import {
  Divider,
  Flex,
  FlexItem,
  Label,
  type LabelProps,
  Menu,
  MenuContent,
  MenuGroup,
  MenuItem,
  MenuList,
  Popper,
} from "@patternfly/react-core";

import { getString } from "@app/utils/utils";

import { LabelToolip } from "../LabelTooltip";
import { SearchInputComponent } from "./SearchInput";
import type { GroupedAutocompleteOptionProps } from "./type-utils";
import { useAutocompleteHandlers } from "./useAutocompleteHandlers";

export interface IAutocompleteProps {
  onChange: (selections: GroupedAutocompleteOptionProps[]) => void;
  id?: string;

  /** The set of options to use for selection */
  options?: GroupedAutocompleteOptionProps[];
  selections?: GroupedAutocompleteOptionProps[];

  placeholderText?: string;
  searchString?: string;
  searchInputAriaLabel?: string;
  labelColor?: LabelProps["color"];
  noResultsMessage?: string;

  showChips?: boolean;
  appendDropdownToDocumentBody?: boolean;
  isInputText?: boolean;
  onSearchChange?: (value: string) => void;
  onCreateNewOption?: (value: string) => GroupedAutocompleteOptionProps;
  validateNewOption?: (value: string) => boolean;
}

/**
 * Multiple type-ahead with table complete and selection labels
 */
export const Autocomplete: React.FC<IAutocompleteProps> = ({
  id = "",
  onChange,
  options = [],
  placeholderText = "Search",
  searchString = "",
  searchInputAriaLabel = "Search input",
  labelColor,
  selections = [],
  noResultsMessage = "No results found",
  showChips,
  isInputText,
  onSearchChange,
  onCreateNewOption,
  validateNewOption,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const {
    setInputValue,
    inputValue,
    menuIsOpen,
    groupedFilteredOptions,
    removeSelectionById,
    handleMenuItemOnSelect,
    handleMenuOnKeyDown,
    handleOnDocumentClick,
    handleInputChange,
    handleKeyDown,
  } = useAutocompleteHandlers({
    options,
    searchString,
    selections,
    onChange,
    menuRef,
    searchInputRef,
    onCreateNewOption,
    validateNewOption,
  });

  const inputGroup = (
    <SearchInputComponent
      id={id}
      placeholderText={placeholderText}
      searchInputAriaLabel={searchInputAriaLabel}
      onSearchChange={(value: string) => {
        handleInputChange(value);
        if (onSearchChange) {
          onSearchChange(value);
        }
      }}
      onClear={() => setInputValue("")}
      onKeyHandling={handleKeyDown}
      options={options}
      inputValue={inputValue}
      inputRef={searchInputRef}
      isInputText={isInputText}
    />
  );

  const renderMenuItems = () => {
    const allGroups = Object.entries(groupedFilteredOptions);
    if (allGroups.length === 0) {
      return (
        <MenuList>
          <MenuItem isDisabled key="no-options">
            {noResultsMessage || "No options available"}
          </MenuItem>
        </MenuList>
      );
    }

    const renderMenuList = (groupOptions: GroupedAutocompleteOptionProps[]) => (
      <MenuList>
        {groupOptions.length > 0 ? (
          groupOptions.map((option) => (
            <MenuItem
              key={option.uniqueId}
              itemId={option.uniqueId}
              onClick={(e) => handleMenuItemOnSelect(e, option)}
            >
              {getString(option.labelName || option.name)}
            </MenuItem>
          ))
        ) : (
          <MenuItem isDisabled key="no result" itemId="-1">
            {noResultsMessage}
          </MenuItem>
        )}
      </MenuList>
    );

    return allGroups.map(([groupName, groupOptions], index) => (
      <React.Fragment key={groupName || `ungrouped-${index}`}>
        {allGroups.length === 1 ? (
          renderMenuList(groupOptions)
        ) : (
          <MenuGroup label={groupName || undefined}>
            {renderMenuList(groupOptions)}
          </MenuGroup>
        )}
        {index < allGroups.length - 1 && <Divider />}
      </React.Fragment>
    ));
  };

  const menu = (
    <Menu ref={menuRef} onKeyDown={handleMenuOnKeyDown} isScrollable>
      <MenuContent>{renderMenuItems()}</MenuContent>
    </Menu>
  );

  return (
    <Flex direction={{ default: "column" }}>
      <FlexItem key="input">
        <Popper
          trigger={inputGroup}
          triggerRef={searchInputRef}
          popper={menu}
          popperRef={menuRef}
          appendTo={() => searchInputRef.current || document.body}
          isVisible={menuIsOpen}
          onDocumentClick={handleOnDocumentClick}
        />
      </FlexItem>
      {showChips && (
        <FlexItem key="chips">
          <Flex spaceItems={{ default: "spaceItemsXs" }}>
            {selections.map((option) => (
              <FlexItem key={option.uniqueId}>
                <LabelToolip content={option.tooltip}>
                  <Label
                    color={labelColor}
                    onClose={() => removeSelectionById(option.uniqueId)}
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
