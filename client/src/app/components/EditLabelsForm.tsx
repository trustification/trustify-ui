import React from "react";

import {
  ActionGroup,
  Button,
  ButtonVariant,
  Card,
  Form,
  FormGroup,
  Label,
  LabelGroup,
  Stack,
  StackItem,
} from "@patternfly/react-core";

import type { SingleLabel } from "@app/api/models";
import { getString } from "@app/utils/utils";

import {
  joinKeyValueAsString,
  splitStringAsKeyValue,
} from "@app/api/model-utils";
import { Autocomplete } from "./Autocomplete/Autocomplete";
import type { GroupedAutocompleteOptionProps } from "./Autocomplete/type-utils";

const keyValueToOption = (
  value: SingleLabel,
): GroupedAutocompleteOptionProps => {
  return {
    uniqueId: value.key,
    name: joinKeyValueAsString(value),
  };
};

interface EditLabelsFormProps {
  title: string;
  value: { [key: string]: string };
  isDisabled: boolean;
  onSave: (value: { [key: string]: string }) => void;
  onClose: () => void;

  // Labels Dropdown
  options: SingleLabel[];
  onInputChange?: (value: string) => void;
}

export const EditLabelsForm: React.FC<EditLabelsFormProps> = ({
  title,
  value,
  isDisabled,
  onSave,
  onClose,
  options,
  onInputChange,
}) => {
  const [selections, setSelections] = React.useState<
    GroupedAutocompleteOptionProps[]
  >(
    Object.entries(value).map(([key, value]) =>
      keyValueToOption({ key, value }),
    ),
  );

  const onSaveForm = () => {
    const labels = selections
      .map((e) => splitStringAsKeyValue(getString(e.name)))
      .reduce((prev, { key, value }) => {
        return Object.assign(prev, { [key]: value });
      }, {});
    onSave(labels);
  };

  return (
    <Stack hasGutter>
      <StackItem>
        Labels help you organize and select resources. Adding labels below will
        let you query for objects that have similar, overlapping or dissimilar
        labels.
      </StackItem>
      <StackItem>
        <FormGroup label={title}>
          <Card>
            <LabelGroup
              style={{ padding: 10, minHeight: 10 }}
              defaultIsOpen
              numLabels={10}
            >
              {selections.map((option, index) => (
                <Label
                  key={option.uniqueId}
                  color="blue"
                  onClose={() => {
                    const newSelected = [...selections];
                    newSelected.splice(index, 1);
                    setSelections(newSelected);
                  }}
                >
                  {getString(option.labelName || option.name)}
                </Label>
              ))}
            </LabelGroup>
          </Card>
        </FormGroup>
      </StackItem>
      <StackItem>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <Autocomplete
            isInputText
            appendDropdownToDocumentBody
            selections={selections}
            options={options.map(({ key, value }) => {
              return keyValueToOption({ key, value });
            })}
            onChange={setSelections}
            noResultsMessage="No search results"
            placeholderText="Labels"
            searchInputAriaLabel="labels-select-toggle"
            onSearchChange={onInputChange}
            onCreateNewOption={(value) => {
              const keyValue = splitStringAsKeyValue(value);
              const option: GroupedAutocompleteOptionProps = {
                uniqueId: keyValue.key,
                name: value,
              };
              return option;
            }}
            validateNewOption={(value) => /^[^=][^=]*=?[^=]*$/.test(value)}
          />

          <ActionGroup>
            <Button
              type="button"
              id="submit"
              aria-label="submit"
              variant={ButtonVariant.primary}
              isDisabled={isDisabled}
              onClick={onSaveForm}
            >
              Save
            </Button>
            <Button
              type="button"
              id="cancel"
              aria-label="cancel"
              variant={ButtonVariant.link}
              isDisabled={isDisabled}
              onClick={onClose}
            >
              Cancel
            </Button>
          </ActionGroup>
        </Form>
      </StackItem>
    </Stack>
  );
};
