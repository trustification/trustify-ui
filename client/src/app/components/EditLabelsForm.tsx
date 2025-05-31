import type React from "react";
import { useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import { array, object, string } from "yup";

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

import type { AutocompleteOptionProps } from "./Autocomplete/type-utils";
import HookFormAutocomplete from "./HookFormPFFields/HookFormAutocomplete";

type FormValues = {
  labels: AutocompleteOptionProps[];
};

interface EditLabelsFormProps {
  title: string;
  value: { [key: string]: string };
  isDisabled: boolean;
  onSave: (value: { [key: string]: string }) => void;
  onClose: () => void;

  // Labels Dropdown
  autocompleteLabels: SingleLabel[];
  keyValueToOption: (value: {
    key: string;
    value?: string;
  }) => AutocompleteOptionProps;

  onCreateNewOption?: (value: string) => AutocompleteOptionProps;
  onLabelInputChange?: (value: string) => void;
}

export const EditLabelsForm: React.FC<EditLabelsFormProps> = ({
  title,
  value,
  isDisabled,
  onSave,
  onClose,
  autocompleteLabels,
  keyValueToOption,
  onCreateNewOption,
  onLabelInputChange,
}) => {
  const validationSchema = object().shape({
    labels: array()
      .of(
        object().shape({
          id: string().min(10),
          name: string().min(10),
        }),
      )
      .max(1),
  });

  const { handleSubmit, getValues, setValue, control, watch, formState } =
    useForm<FormValues>({
      defaultValues: {
        labels: Object.entries(value).map(([key, value]) => {
          return keyValueToOption({ key, value });
        }),
      },
      resolver: yupResolver(validationSchema),
      mode: "onChange",
    });

  const labels = watch("labels");

  const onSaveForm = () => {
    const labelsObject: { [key: string]: string } = getValues().labels.reduce(
      (prev, { name }) => {
        const optionName = typeof name === "function" ? name() : name;
        const [k, v] = optionName.split("=");
        return Object.assign(prev, { [k]: v ?? "" });
      },
      {},
    );
    onSave(labelsObject);
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
              {labels.map((option) => (
                <Label
                  key={option.id}
                  color="blue"
                  onClose={() => {
                    const newLabels = labels.filter((e) => e.id !== option.id);
                    setValue("labels", newLabels);
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
        <Form onSubmit={handleSubmit(() => {})}>
          <HookFormAutocomplete
            isInputText
            appendDropdownToDocumentBody
            items={autocompleteLabels.map(({ key, value }) =>
              keyValueToOption({ key, value }),
            )}
            control={control}
            name="labels"
            label="Label"
            fieldId="labels"
            noResultsMessage={onCreateNewOption ? "" : "No search results"}
            placeholderText=""
            searchInputAriaLabel="labels-select-toggle"
            onSearchChange={onLabelInputChange}
            onCreateNewOption={onCreateNewOption}
            // validateNewOption={(value) => {
            //   return /^[a-zA-Z0-9]([-a-zA-Z0-9]*[a-zA-Z0-9])?$/.test(value);
            // }}
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
