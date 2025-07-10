import React from "react";

import {
  ActionGroup,
  Button,
  ButtonVariant,
  Card,
  Content,
  Form,
  FormGroup,
  Label,
  LabelGroup,
  Stack,
  StackItem,
} from "@patternfly/react-core";

import type { Label as LabelModel } from "@app/api/models";
import { getString } from "@app/utils/utils";

import {
  joinKeyValueAsString,
  splitStringAsKeyValue,
} from "@app/api/model-utils";
import { Autocomplete } from "./Autocomplete/Autocomplete";
import type { AutocompleteOptionProps } from "./Autocomplete/type-utils";

const keyValueToOption = (value: LabelModel): AutocompleteOptionProps => {
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
  options: LabelModel[];
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
  const [selections, setSelections] = React.useState<AutocompleteOptionProps[]>(
    Object.entries(value).map(([key, value]) =>
      keyValueToOption({ key, value }),
    ),
  );

  const onSaveForm = () => {
    const labels = selections
      .map((e) => splitStringAsKeyValue(getString(e.name)))
      .reduce(
        (prev, { key, value }) => {
          prev[key] = value ?? "";
          return prev;
        },
        {} as Record<string, string>,
      );
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
        <FormGroup label={<Content component="h4">{title}</Content>}>
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
            selections={selections}
            options={options.map(({ key, value }) => {
              return keyValueToOption({ key, value });
            })}
            onChange={setSelections}
            placeholderText="Add label"
            searchInputAriaLabel="labels-select-toggle"
            onSearchChange={onInputChange}
            onCreateNewOption={(value) => {
              const option: AutocompleteOptionProps = {
                id: value,
                name: value,
              };
              return option;
            }}
            // The following regex ensures:
            // - No backslashes anywhere in the string
            // - The string does not start with whitespace or '='
            // - The string does not start with a backslash
            // - The string contains an optional '=' with optional whitespace around it
            // - Both key and value parts do not contain backslashes or are empty
            // - The key does not start with whitespace or '='
            // This is used to validate new label options in the form.
            validateNewOption={(value) =>
              !!value &&
              value.trim().length > 0 &&
              /^(?!.*\\)(?!\s*\\)(?!\s*=)[^=\\\s][^=\\]*\s*=?\s*[^=\\]+$/.test(
                value,
              )
            }
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
