import type { Control, FieldValues, Path } from "react-hook-form";

import { Autocomplete } from "@app/components/Autocomplete/Autocomplete";
import { HookFormPFGroupController } from "@app/components/HookFormPFFields";
import type { GroupedAutocompleteOptionProps } from "../Autocomplete/type-utils";

export const HookFormAutocomplete = <FormValues extends FieldValues>({
  groupedItems = [],
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
  validateNewOption,
  appendDropdownToDocumentBody,
}: {
  groupedItems?: GroupedAutocompleteOptionProps[];
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
  onCreateNewOption?: (value: string) => GroupedAutocompleteOptionProps;
  validateNewOption?: (value: string) => boolean;
  appendDropdownToDocumentBody?: boolean;
}) => (
  <HookFormPFGroupController
    isRequired={isRequired}
    control={control}
    name={name}
    label={label}
    fieldId={fieldId}
    renderInput={({ field: { value, onChange } }) => (
      <Autocomplete
        id={fieldId}
        noResultsMessage={noResultsMessage}
        placeholderText={placeholderText}
        searchInputAriaLabel={searchInputAriaLabel}
        options={groupedItems}
        selections={value}
        onChange={(selection) => {
          onChange(selection);
        }}
        showChips={showChips}
        isInputText={isInputText}
        onSearchChange={onSearchChange}
        onCreateNewOption={onCreateNewOption}
        validateNewOption={validateNewOption}
        appendDropdownToDocumentBody={appendDropdownToDocumentBody}
      />
    )}
  />
);

export default HookFormAutocomplete;
