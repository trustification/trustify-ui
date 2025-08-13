import type React from "react";

import {
  Button,
  TextInputGroup,
  TextInputGroupMain,
  TextInputGroupUtilities,
} from "@patternfly/react-core";
import SearchIcon from "@patternfly/react-icons/dist/esm/icons/search-icon";
import TimesIcon from "@patternfly/react-icons/dist/esm/icons/times-icon";

import { getString } from "@app/utils/utils";

import type { AutocompleteOptionProps } from "./type-utils";

export interface SearchInputProps {
  id: string;
  placeholder: string;
  ariaLabel: string;
  onSearchChange: (value: string) => void;
  onClear: () => void;
  onKeyHandling: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onClick: () => void;
  inputValue: string;
  inputRef: React.RefObject<HTMLInputElement | null>;

  options: AutocompleteOptionProps[];

  isDropdownOpen: boolean;
  activeItem: AutocompleteOptionProps | null;
}

export const SearchInputComponent: React.FC<SearchInputProps> = ({
  id,
  placeholder,
  ariaLabel,
  onSearchChange,
  onClear,
  onKeyHandling,
  onClick,
  options,
  inputValue,
  inputRef,
  isDropdownOpen,
  activeItem,
}) => {
  const getHint = (): string => {
    if (options.length === 0) {
      return "";
    }

    if (options.length === 1 && inputValue) {
      const fullHint = getString(options[0].name);
      if (fullHint.toLowerCase().indexOf(inputValue.toLowerCase()) === 0) {
        return inputValue + fullHint.substring(inputValue.length);
      }
    }

    return "";
  };

  const hint = getHint();

  return (
    <TextInputGroup isPlain>
      <TextInputGroupMain
        id={id}
        value={inputValue}
        onClick={onClick}
        onChange={(_e, value) => onSearchChange(value)} // verified
        onKeyDown={onKeyHandling} // in progress
        autoComplete="off"
        innerRef={inputRef}
        placeholder={placeholder}
        {...(activeItem && { "aria-activedescendant": activeItem.id })}
        role="combobox"
        isExpanded={isDropdownOpen}
        aria-label={ariaLabel}
        aria-controls="select-typeahead-listbox"
        hint={hint}
        icon={<SearchIcon />}
      />

      <TextInputGroupUtilities>
        {!!inputValue && (
          <Button
            icon={<TimesIcon aria-hidden />}
            variant="plain"
            onClick={onClear}
            aria-label="Clear input value"
          />
        )}
      </TextInputGroupUtilities>
    </TextInputGroup>
  );
};
