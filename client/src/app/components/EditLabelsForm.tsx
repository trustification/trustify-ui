import React from "react";
import { useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";

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
  StackItem
} from "@patternfly/react-core";

import { singleLabelString } from "@app/api/model-utils";

import { HookFormPFTextInput } from "./HookFormPFFields";

type FormValues = {
  label: string;
};

interface EditLabelsFormProps {
  title: string;
  value: { [key: string]: string };
  isDisabled: boolean;
  onSave: (value: { [key: string]: string }) => void;
  onClose: () => void;
}

export const EditLabelsForm: React.FC<EditLabelsFormProps> = ({
  title,
  value,
  isDisabled,
  onSave,
  onClose,
}) => {
  const validationSchema = object().shape({
    label: string()
      .trim()
      .matches(/^[^=][^=]*=?[^=]*$/)
      .max(120),
  });

  const { handleSubmit, control, reset } = useForm<FormValues>({
    defaultValues: {
      label: "",
    },
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const [labelArray, setLabelArray] = React.useState(
    Object.entries(value).sort(([keyA], [keyB]) => keyB.localeCompare(keyA)),
  );

  const onAddLabel = (formValues: FormValues) => {
    if (!formValues.label) {
      return;
    }

    const [newKey, newValue] = formValues.label.split("=");

    const newLabels = labelArray.filter(([key]) => key !== newKey);
    setLabelArray([...newLabels, [newKey, newValue ?? ""]]);

    reset();
  };

  const onSaveForm = () => {
    const labelsObject: { [key: string]: string } = labelArray.reduce(
      (prev, [k, v]) => {
        return Object.assign(prev, { [k]: v });
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
              {labelArray.map(([k, v], index) => (
                <Label
                  key={`${k}=${v}`}
                  color="blue"
                  onClose={() => {
                    const newLabels = [...labelArray];
                    newLabels.splice(index, 1);
                    setLabelArray(newLabels);
                  }}
                >
                  {singleLabelString({ key: k, value: v })}
                </Label>
              ))}
            </LabelGroup>
          </Card>
        </FormGroup>
      </StackItem>
      <StackItem>
        <Form onSubmit={handleSubmit(onAddLabel)}>
          <HookFormPFTextInput
            control={control}
            name="label"
            label="Label"
            fieldId="label"
            isRequired
            isDisabled={isDisabled}
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
