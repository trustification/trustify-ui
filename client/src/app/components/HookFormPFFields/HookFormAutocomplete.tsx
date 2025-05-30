import type { Control, FieldValues, Path } from "react-hook-form";

import {
  Autocomplete,
  type AutocompleteOptionProps,
} from "@app/components/Autocomplete/Autocomplete";
import { HookFormPFGroupController } from "@app/components/HookFormPFFields";

import {
  GroupedAutocomplete,
  type GroupedAutocompleteOptionProps,
} from "../Autocomplete/GroupedAutocomplete";

export const HookFormAutocomplete = <FormValues extends FieldValues>({
  items = [],
  groupedItems = [],
  isGrouped = false,
  label,
  fieldId,
  name,
  control,
  noResultsMessage,
  placeholderText,
  searchInputAriaLabel,
  isRequired = false,
  showChips,
  isInputText = false,
  onSearchChange,
  onCreateNewOption,
}: {
  items?: AutocompleteOptionProps[];
  groupedItems?: GroupedAutocompleteOptionProps[];
  isGrouped?: boolean;
  name: Path<FormValues>;
  control: Control<FormValues>;
  label: string;
  fieldId: string;
  noResultsMessage: string;
  placeholderText: string;
  searchInputAriaLabel: string;
  isRequired?: boolean;
  showChips?: boolean;
  isInputText?: boolean;
  onSearchChange?: (value: string) => void;
  onCreateNewOption?: (value: string) => AutocompleteOptionProps;
}) => (
  <HookFormPFGroupController
    isRequired={isRequired}
    control={control}
    name={name}
    label={label}
    fieldId={fieldId}
    renderInput={({ field: { value, onChange } }) =>
      isGrouped ? (
        <GroupedAutocomplete
          id={fieldId}
          noResultsMessage={noResultsMessage}
          placeholderText={placeholderText}
          searchInputAriaLabel={searchInputAriaLabel}
          options={groupedItems}
          selections={value}
          onChange={(selection) => {
            onChange(selection.map((e) => ({ id: e.name, name: e.name })));
          }}
          showChips={showChips}
          isInputText={isInputText}
          onSearchChange={onSearchChange}
          onCreateNewOption={onCreateNewOption}
        />
      ) : (
        <Autocomplete
          id={fieldId}
          noResultsMessage={noResultsMessage}
          placeholderText={placeholderText}
          searchInputAriaLabel={searchInputAriaLabel}
          options={items}
          selections={value}
          onChange={(selection) => {
            onChange(selection);
          }}
          showChips={showChips}
          isInputText={isInputText}
          onSearchChange={onSearchChange}
          onCreateNewOption={onCreateNewOption}
        />
      )
    }
  />
);

export default HookFormAutocomplete;
