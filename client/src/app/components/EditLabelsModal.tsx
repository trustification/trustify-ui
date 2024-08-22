import React from "react";

import {
  Button,
  ButtonVariant,
  Form,
  FormGroup,
  Grid,
  GridItem,
  Label,
  LabelGroup,
  Modal,
  ModalVariant,
  Stack,
  StackItem,
  TextInput,
} from "@patternfly/react-core";

interface EditLabelsProps {
  resourceName: string;
  value: { [key: string]: string };
  onSave: (value: { [key: string]: string }) => void;
  onClose: () => void;
}

export const EditLabelsModal: React.FC<EditLabelsProps> = ({
  resourceName,
  value,
  onSave,
  onClose,
}) => {
  const [inputKey, setInputKey] = React.useState("");
  const [inputValue, setInputValue] = React.useState("");

  const [labels, setLabels] = React.useState(
    Object.entries(value).sort(([keyA], [keyB]) => keyB.localeCompare(keyA))
  );

  const addLabel = () => {
    if (!inputKey || !inputValue) {
      return;
    }

    const newLabels = labels.filter(([key]) => key !== inputKey);
    setLabels([...newLabels, [inputKey, inputValue]]);

    setInputKey("");
    setInputValue("");
  };

  const save = () => {
    const value: { [key: string]: string } = labels.reduce((prev, [k, v]) => {
      return {
        ...prev,
        [k]: v,
      };
    }, {});
    onSave(value);
  };

  return (
    <Modal
      isOpen
      variant={ModalVariant.small}
      title="Edit labels"
      onClose={onClose}
      actions={[
        <Button key="Save" variant="primary" onClick={save}>
          Save
        </Button>,
        <Button key="cancel" variant="link" onClick={onClose}>
          Cancel
        </Button>,
      ]}
      ouiaId="BasicModal"
    >
      <Stack hasGutter>
        <StackItem>
          Labels help you organize and select resources. Adding labels below
          will let you query for objects that have similar, overlapping or
          dissimilar labels.
        </StackItem>
        <StackItem>
          <div className="pf-v5-c-form">
            <FormGroup label={`Labels for ${resourceName}`}>
              <LabelGroup
                className="pf-v5-c-form-control"
                style={{ padding: 10, minHeight: 10 }}
                defaultIsOpen
                numLabels={10}
              >
                {labels.map(([k, v], index) => (
                  <Label
                    key={index}
                    color="blue"
                    onClose={() => {
                      const newLabels = [...labels];
                      newLabels.splice(index, 1);
                      setLabels(newLabels);
                    }}
                  >
                    {`${k}=${v}`}
                  </Label>
                ))}
              </LabelGroup>
            </FormGroup>
          </div>
        </StackItem>
        <StackItem>
          <Form
            onSubmit={(e) => {
              addLabel();
              e.preventDefault();
            }}
          >
            <Grid hasGutter>
              <GridItem md={5}>
                <FormGroup label="Key" isRequired fieldId="key">
                  <TextInput
                    isRequired
                    type="text"
                    id="key"
                    name="key"
                    value={inputKey}
                    onChange={(_, value) => setInputKey(value)}
                  />
                </FormGroup>
              </GridItem>
              <GridItem md={5}>
                <FormGroup label="Value" isRequired fieldId="value">
                  <TextInput
                    isRequired
                    type="text"
                    id="value"
                    name="value"
                    value={inputValue}
                    onChange={(_, value) => setInputValue(value)}
                  />
                </FormGroup>
              </GridItem>
              <GridItem md={2}>
                <FormGroup label="Action">
                  <Button
                    type="submit"
                    variant={ButtonVariant.secondary}
                    onClick={addLabel}
                  >
                    Add
                  </Button>
                </FormGroup>
              </GridItem>
            </Grid>
          </Form>
        </StackItem>
      </Stack>
    </Modal>
  );
};
