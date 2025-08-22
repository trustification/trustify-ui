import { useMemo, useState } from "react";

import type { AutocompleteOptionProps } from "./type-utils";

interface IAutocompleteHandlersProps {
  options: AutocompleteOptionProps[];
  searchString: string;
  selections: AutocompleteOptionProps[];
  onChange: (selections: AutocompleteOptionProps[]) => void;
  // Triggered before onChange is called and is applied to all current selections
  // Internally used for filtering Labels and allow only one key.
  filterBeforeOnChange?: (
    selections: AutocompleteOptionProps[],
    value: AutocompleteOptionProps,
  ) => AutocompleteOptionProps[];
  menuRef: React.RefObject<HTMLDivElement | null>;
  searchInputRef: React.RefObject<HTMLDivElement | null>;
  onCreateNewOption?: (value: string) => AutocompleteOptionProps;
  validateNewOption?: (value: string) => boolean;
  onSearchChange?: (value: string) => void;
}

export const useAutocompleteHandlers = ({
  options,
  searchString,
  selections,
  onChange,
  menuRef,
  searchInputRef,
  onCreateNewOption,
  validateNewOption,
  onSearchChange,
  filterBeforeOnChange: filterBeforeSelect,
}: IAutocompleteHandlersProps) => {
  const [inputValue, setInputValue] = useState(searchString);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [activeItem, setActiveItem] = useState<AutocompleteOptionProps | null>(
    null,
  );
  const [focusedItemIndex, setFocusedItemIndex] = useState<number | null>(null);

  const optionsNotSelected = useMemo(() => {
    return options.filter((option) => {
      const isOptionSelected = selections.some(
        (selection) => selection.id === option.id,
      );
      return !isOptionSelected;
    });
  }, [options, selections]);

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

  // Selecting an item
  const handleOnSelect = (value: AutocompleteOptionProps) => {
    const filteredSelections = filterBeforeSelect
      ? filterBeforeSelect(selections, value)
      : selections;

    const updatedSelections = [...filteredSelections, value];
    onChange(updatedSelections);

    handleInputChange("");
    setIsDropdownOpen(false);
  };

  const handleOnCreateNewOption = (value: string) => {
    if (value !== "" && onCreateNewOption) {
      const isValid = validateNewOption ? validateNewOption(value) : true;
      if (isValid) {
        const newOption = onCreateNewOption(value);
        handleOnSelect(newOption);
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case "Enter": {
        if (activeItem) {
          handleOnSelect(activeItem);
        } else {
          handleOnCreateNewOption(inputValue);
        }

        break;
      }
      case "Tab":
      case "Escape":
        event.preventDefault();
        setIsDropdownOpen(false);
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
          focusedItemIndex === optionsNotSelected.length - 1
        ) {
          indexToFocus = 0;
        } else {
          indexToFocus = focusedItemIndex + 1;
        }
      }
    }
    setFocusedItemIndex(indexToFocus);
    const focusedItem = optionsNotSelected.filter(
      ({ optionProps }) => !optionProps?.isDisabled,
    )[indexToFocus];
    setActiveItem(focusedItem);
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
    optionsNotSelected,
    handleInputChange,
    handleKeyDown,
    handleOnSelect,
    handleOnCreateNewOption,
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
