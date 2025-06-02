import { useMemo, useState } from "react";

import type { GroupMap, GroupedAutocompleteOptionProps } from "./type-utils";

interface AutocompleteLogicProps {
  options: GroupedAutocompleteOptionProps[];
  searchString: string;
  selections: GroupedAutocompleteOptionProps[];
  onChange: (selections: GroupedAutocompleteOptionProps[]) => void;
  menuRef: React.RefObject<HTMLDivElement>;
  searchInputRef: React.RefObject<HTMLDivElement>;
  onCreateNewOption?: (value: string) => GroupedAutocompleteOptionProps;
  validateNewOption?: (value: string) => boolean;
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
}: AutocompleteLogicProps) => {
  const [inputValue, setInputValue] = useState(searchString);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [tabSelectedItemId, setTabSelectedItemId] = useState<
    string | number | null
  >(null);

  const groupedFilteredOptions = useMemo(() => {
    const groups: GroupMap = {};

    for (const option of options) {
      const isOptionSelected = selections.some(
        (selection) => selection.uniqueId === option.uniqueId,
      );

      const optionName =
        typeof option.name === "function" ? option.name() : option.name;

      if (
        !isOptionSelected &&
        optionName.toLowerCase().includes(inputValue.toLowerCase())
      ) {
        const groupName = "group" in option && option.group ? option.group : "";

        if (!groups[groupName]) {
          groups[groupName] = [];
        }

        // Add the option to the appropriate group
        groups[groupName].push(option);
      }
    }

    return groups;
  }, [options, selections, inputValue]);
  const allOptions = Object.values(groupedFilteredOptions).flat();

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  const addSelectionByCreateNewOption = () => {
    if (inputValue && onCreateNewOption) {
      const isValid = validateNewOption ? validateNewOption(inputValue) : true;
      if (isValid) {
        const newOption = onCreateNewOption(inputValue);

        const newSelections = [
          ...selections.filter(
            (option) => option.uniqueId !== newOption.uniqueId,
          ),
          newOption,
        ];
        onChange(newSelections);

        setInputValue("");
        setMenuIsOpen(false);
      }
    }
  };

  const addSelectionByItemId = (itemId: string | number) => {
    const matchingOption = options.find((option) => option.uniqueId === itemId);

    if (matchingOption) {
      const updatedSelections = [...selections, matchingOption].filter(Boolean);
      onChange(updatedSelections);
      setInputValue("");
      setMenuIsOpen(false);
    }
  };

  const removeSelectionById = (idToDelete: string | number) => {
    const updatedSelections = selections.filter(
      (selection) => selection.uniqueId !== idToDelete,
    );

    onChange(updatedSelections);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case "Enter":
        if (tabSelectedItemId) {
          addSelectionByItemId(tabSelectedItemId);
          setTabSelectedItemId(null);
        } else {
          addSelectionByCreateNewOption();
        }
        break;
      case "Escape":
        event.stopPropagation();
        setMenuIsOpen(false);
        break;
      case "Tab":
        break;

      case "ArrowUp":
      case "ArrowDown":
        if (menuRef.current) {
          const firstElement = menuRef.current.querySelector<HTMLButtonElement>(
            "li > button:not(:disabled)",
          );
          firstElement?.focus();
        }
        break;
      default:
        if (!menuIsOpen) setMenuIsOpen(true);
        break;
    }
  };

  // Click handling outside of component to close menu
  const handleOnDocumentClick = (event?: MouseEvent) => {
    if (!event) {
      return;
    }
    if (searchInputRef.current?.contains(event.target as HTMLElement)) {
      setMenuIsOpen(true);
    }
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target as HTMLElement) &&
      searchInputRef.current &&
      !searchInputRef.current.contains(event.target as HTMLElement)
    ) {
      setMenuIsOpen(false);
    }
  };

  // Menu-specific key handling
  const handleMenuOnKeyDown = (event: React.KeyboardEvent) => {
    if (["Tab", "Escape"].includes(event.key)) {
      event.preventDefault();
      searchInputRef.current?.querySelector("input")?.focus();
      setMenuIsOpen(false);
    }
  };

  // Selecting an item from the menu
  const handleMenuItemOnSelect = (
    event: React.MouseEvent<Element, MouseEvent> | undefined,
    option: GroupedAutocompleteOptionProps,
  ) => {
    if (!event) return;
    event.stopPropagation();
    searchInputRef.current?.querySelector("input")?.focus();
    addSelectionByItemId(option.uniqueId);
  };

  return {
    setInputValue,
    inputValue,
    menuIsOpen,
    groupedFilteredOptions,
    handleInputChange,
    handleKeyDown,
    handleMenuItemOnSelect,
    handleOnDocumentClick,
    handleMenuOnKeyDown,
    menuRef,
    searchInputRef,
    removeSelectionById,
    allOptions,
  };
};
