import { useState } from "react";

import type { AsyncMultiSelectOptionProps } from "./type-utils";

interface IAsyncAutocompleteHandlersProps {
  options: AsyncMultiSelectOptionProps[];
  searchString: string;
  selections: AsyncMultiSelectOptionProps[];
  onChange: (selections: AsyncMultiSelectOptionProps[]) => void;

  menuRef: React.RefObject<HTMLDivElement | null>;
  searchInputRef: React.RefObject<HTMLDivElement | null>;

  onSearchChange?: (value: string) => void;
}

export const useAutocompleteHandlers = ({
  options,
  searchString,
  selections,
  onChange,
  menuRef,
  searchInputRef,
  onSearchChange,
}: IAsyncAutocompleteHandlersProps) => {
  const [inputValue, setInputValue] = useState(searchString);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [activeItem, setActiveItem] =
    useState<AsyncMultiSelectOptionProps | null>(null);
  const [focusedItemIndex, setFocusedItemIndex] = useState<number | null>(null);

  const resetActiveAndFocusedItem = () => {
    setFocusedItemIndex(null);
    setActiveItem(null);
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    resetActiveAndFocusedItem();

    if (value && !isDropdownOpen) {
      setIsDropdownOpen(true);
    }

    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  const removeSelectionById = (id: string | number) => {
    const updatedSelections = selections.filter(
      (selection) => selection.id !== id,
    );

    onChange(updatedSelections);
  };

  const handleOnSelect = (value: AsyncMultiSelectOptionProps) => {
    const isSelected = selections.some(
      (selection) => selection.id === value.id,
    );
    const updatedSelections = isSelected
      ? selections.filter((selection) => selection.id !== value.id)
      : [...selections, value];
    onChange(updatedSelections);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case "Enter": {
        if (activeItem) {
          handleOnSelect(activeItem);
        }
        if (!isDropdownOpen) {
          setIsDropdownOpen(true);
        } else if (activeItem !== null) {
          handleOnSelect(activeItem);
        }
        searchInputRef?.current?.focus();
        break;
      }
      case "Tab":
      case "Escape":
        setIsDropdownOpen(false);
        setActiveItem(null);
        break;
      case "ArrowUp":
      case "ArrowDown":
        event.preventDefault();
        if (isDropdownOpen) {
          handleMenuArrowKeys(event.key);
        } else {
          setIsDropdownOpen(true);
        }
        break;
      default:
        break;
    }
  };

  const handleMenuArrowKeys = (key: string) => {
    let indexToFocus = 0;
    if (isDropdownOpen) {
      if (key === "ArrowUp") {
        if (focusedItemIndex === null || focusedItemIndex === 0) {
          indexToFocus = options.length - 1;
        } else {
          indexToFocus = focusedItemIndex - 1;
        }
      }
      if (key === "ArrowDown") {
        if (
          focusedItemIndex === null ||
          focusedItemIndex === options.length - 1
        ) {
          indexToFocus = 0;
        } else {
          indexToFocus = focusedItemIndex + 1;
        }
      }
    }
    setFocusedItemIndex(indexToFocus);
    const focusedItem = options.filter(
      ({ optionProps }) => !optionProps?.isDisabled,
    )[indexToFocus];
    setActiveItem(focusedItem ?? null);
  };

  const handleClearSearchInput = () => {
    handleInputChange("");
    searchInputRef?.current?.focus();
  };

  const handleClickSearchInput = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClickToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
    searchInputRef.current?.focus();
  };

  return {
    setInputValue,
    inputValue,
    isDropdownOpen,
    setIsDropdownOpen,
    handleInputChange,
    handleKeyDown,
    handleOnSelect,
    menuRef,
    searchInputRef,
    removeSelectionById,
    handleClearSearchInput,
    handleClickSearchInput,
    handleClickToggle,
    activeItem,
    focusedItemIndex,
  };
};
