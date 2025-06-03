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
import type { AutocompleteOptionProps } from "./Autocomplete/type-utils";

const keyValueToOption = (value: SingleLabel): AutocompleteOptionProps => {
  const keyValue = joinKeyValueAsString(value);
  return {
    id: keyValue,
    name: keyValue,
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
  isLoadingOptions: boolean;
  onInputChange?: (value: string) => void;
}

export const EditLabelsForm: React.FC<EditLabelsFormProps> = ({
  title,
  value,
  isDisabled,
  onSave,
  onClose,
  options,
  isLoadingOptions,
  onInputChange,
}) => {
  const [selections, setSelections] = React.useState<AutocompleteOptionProps[]>(
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
              {selections
                .sort((a, b) =>
                  getString(a.name).localeCompare(getString(b.name)),
                )
                .map((option, index) => (
                  <Label
                    key={option.id}
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
        <Form onSubmit={(e) => e.preventDefault()}>
          <Autocomplete
            isLoading={isLoadingOptions}
            selections={selections}
            options={options.map(({ key, value }) => {
              return keyValueToOption({ key, value });
            })}
            onChange={setSelections}
            placeholderText="Label"
            searchInputAriaLabel="labels-select-toggle"
            onSearchChange={onInputChange}
            onCreateNewOption={(value) => {
              const option: AutocompleteOptionProps = {
                id: value,
                name: value,
              };
              return option;
            }}
            validateNewOption={(value) => /^[^=][^=]*=?[^=]*$/.test(value)}
            filterBeforeOnChange={(selections, newOption) => {
              const newOptionKeyValue = splitStringAsKeyValue(
                getString(newOption.name),
              );
              return selections.filter((option) => {
                const optionKeyValue = splitStringAsKeyValue(
                  getString(option.name),
                );
                return optionKeyValue.key !== newOptionKeyValue.key;
              });
            }}
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
