import React, { useContext } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { AxiosError } from "axios";
import { useFieldArray, useForm } from "react-hook-form";
import { array, boolean, number, object, string } from "yup";

import {
  ActionGroup,
  Button,
  ButtonVariant,
  Form,
  FormFieldGroupExpandable,
  FormFieldGroupHeader,
  FormGroup,
  FormSelect,
  FormSelectOption,
  NumberInput,
  Popover,
  PopoverPosition,
  Split,
  SplitItem,
  Stack,
  StackItem,
  Switch,
  TextInput,
} from "@patternfly/react-core";
import MinusIcon from "@patternfly/react-icons/dist/esm/icons/minus-icon";
import PlusCircleIcon from "@patternfly/react-icons/dist/esm/icons/plus-circle-icon";
import QuestionCircleIcon from "@patternfly/react-icons/dist/esm/icons/question-circle-icon";
import spacing from "@patternfly/react-styles/css/utilities/Spacing/spacing";

import {
  useCreateImporterMutation,
  useUpdateImporterMutation,
} from "@app/queries/importers";

import { Importer, ImporterConfiguration, SbomImporter } from "@app/client";
import {
  HookFormPFGroupController,
  HookFormPFSelect,
  HookFormPFTextArea,
  HookFormPFTextInput,
} from "@app/components/HookFormPFFields";
import { NotificationsContext } from "@app/components/NotificationsContext";

const getPeriodValue = (period?: string) => {
  try {
    return period ? parseInt(period.substring(0, period.length - 1)) : null;
  } catch (e) {
    return null;
  }
};

const getPeriodUnit = (period?: string): PeriodUnitType | null => {
  try {
    return period
      ? (period.substring(period.length - 1) as PeriodUnitType)
      : null;
  } catch (e) {
    return null;
  }
};

const ALL_PERIOD_UNITS = ["s", "m", "h", "d", "w", "M", "y"] as const;
type PeriodUnitType = (typeof ALL_PERIOD_UNITS)[number];
type PeriodUnitProps = {
  [key in PeriodUnitType]: {
    label: string;
  };
};
const PERIOD_UNIT_LIST: PeriodUnitProps = {
  s: { label: "seconds" },
  m: { label: "minutes" },
  h: { label: "hours" },
  d: { label: "days" },
  w: { label: "weeks" },
  M: { label: "months" },
  y: { label: "years" },
};

type FormValues = {
  name: string;
  description: string;
  type: ImporterType;
  source: string;
  periodValue: number;
  periodUnit: PeriodUnitType;
  v3Signatures: boolean;
  enabled: boolean;
  keys: { value: string }[];
  onlyPatterns: { value: string }[];
};

export const ALL_IMPORTERS = ["sbom", "csaf", "osv", "cve"] as const;
type ImporterType = (typeof ALL_IMPORTERS)[number];

export interface IImporterFormProps {
  importer: Importer | null;
  onClose: () => void;
}

export const ImporterForm: React.FC<IImporterFormProps> = ({
  importer,
  onClose,
}) => {
  const { pushNotification } = useContext(NotificationsContext);

  const validationSchema = object().shape({
    name: string().trim().required().min(3).max(120),
    description: string().trim().max(250),
    type: string().trim().required().min(3).max(250),
    source: string().trim().required().min(3).max(250),
    periodValue: number().required().min(1),
    periodUnit: string().trim().required().max(250),
    v3Signatures: boolean().required(),
    enabled: boolean().required(),
    keys: array(object().shape({ value: string() })),
    onlyPatterns: array(object().shape({ value: string() })),
  });

  const importerType = Object.keys(
    importer?.configuration ?? {}
  )[0] as ImporterType;

  const importerConfiguration = importer?.configuration
    ? ((importer?.configuration as any)[importerType] as SbomImporter)
    : undefined;

  const periodValue = getPeriodValue(importerConfiguration?.period);
  const periodUnit = getPeriodUnit(importerConfiguration?.period);

  const {
    handleSubmit,
    formState: { isSubmitting, isValidating, isValid, isDirty },
    control,
    setValue,
    getValues,
    trigger,
  } = useForm<FormValues>({
    defaultValues: {
      name: importer?.name || "",
      description: importerConfiguration?.description || "",
      type: importer ? importerType : "sbom",
      source: importerConfiguration?.source || "",
      periodValue: periodValue || 60,
      periodUnit: periodUnit || "s",
      v3Signatures: importerConfiguration?.v3Signatures ?? false,
      enabled: importerConfiguration?.disabled ?? true,
      keys: importerConfiguration?.keys?.map((e) => ({ value: e })) ?? [],
      onlyPatterns:
        importerConfiguration?.onlyPatterns?.map((e) => ({ value: e })) ?? [],
    },
    resolver: yupResolver(validationSchema),
    // mode: "onChange",
  });

  const {
    fields: fieldsKeys,
    append: appendKeys,
    remove: removeKeys,
  } = useFieldArray({
    control: control,
    name: "keys",
  });

  const onCreateSuccess = () =>
    pushNotification({
      title: "Importer created",
      variant: "success",
    });

  const onCreateError = (error: AxiosError) => {
    pushNotification({
      title: "Error while creating the Importer",
      variant: "danger",
    });
  };

  const { mutate: createImporter } = useCreateImporterMutation(
    onCreateSuccess,
    onCreateError
  );

  const onUpdateSuccess = () =>
    pushNotification({
      title: "Importer updated",
      variant: "success",
    });

  const onUpdateError = (error: AxiosError) => {
    pushNotification({
      title: "Error while updating the Importer",
      variant: "danger",
    });
  };
  const { mutate: updateImporter } = useUpdateImporterMutation(
    onUpdateSuccess,
    onUpdateError
  );

  const onSubmit = (formValues: FormValues) => {
    const configuration: SbomImporter = {
      ...importerConfiguration!,
      description: formValues.description.trim(),
      source: formValues.source.trim(),
      period: `${formValues.periodValue}${formValues.periodUnit.trim()}`,
      v3Signatures: formValues.v3Signatures,
      disabled: !formValues.enabled,
      keys: formValues.keys.map((e) => e.value),
      onlyPatterns: formValues.onlyPatterns.map((e) => e.value),
    };

    const payload = {
      [formValues.type]: configuration,
    } as ImporterConfiguration;

    if (importer) {
      updateImporter({
        importerName: formValues.name,
        configuration: payload,
      });
    } else {
      createImporter({
        importerName: formValues.name,
        configuration: payload,
      });
    }
    onClose();
  };

  const fillDemoSettings = () => {
    if (getValues().type === "sbom") {
      setValue("source", "https://access.redhat.com/security/data/sbom/beta/");
      setValue("keys", [
        {
          value:
            "https://access.redhat.com/security/data/97f5eac4.txt#77E79ABE93673533ED09EBE2DCE3823597F5EAC4",
        },
      ]);
    } else if (getValues().type === "csaf") {
      setValue(
        "source",
        "https://redhat.com/.well-known/csaf/provider-metadata.json"
      );
      setValue("keys", []);
    }
    setValue("v3Signatures", true);
    trigger();
  };

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <HookFormPFSelect
          control={control}
          name="type"
          label="Type"
          fieldId="type"
          isRequired
        >
          {ALL_IMPORTERS.map((option, index) => (
            <FormSelectOption key={index} value={option} label={option} />
          ))}
        </HookFormPFSelect>
        <HookFormPFTextInput
          control={control}
          name="name"
          label="Name"
          fieldId="name"
          isRequired
          isDisabled={!!importer}
        />
        <HookFormPFTextArea
          control={control}
          name="description"
          label="Description"
          fieldId="description"
          resizeOrientation="vertical"
        />
        <HookFormPFGroupController
          control={control}
          name="enabled"
          fieldId="enabled"
          renderInput={({ field: { value, onChange } }) => (
            <span>
              <Switch
                id="enabled"
                label="Enable"
                aria-label="Enable importer"
                isChecked={value}
                onChange={(_, checked) => {
                  onChange(checked);
                }}
              />
              <Popover
                position={PopoverPosition.top}
                aria-label="Enable importer"
                bodyContent="Whether or not the Importer is enabled to be executed continuously"
                className="popover"
              >
                <span className={`${spacing.mlSm} pf-v6-c-icon pf-m-info`}>
                  <QuestionCircleIcon />
                </span>
              </Popover>
            </span>
          )}
        />

        <FormFieldGroupExpandable
          isExpanded
          header={
            <FormFieldGroupHeader
              titleText={{
                id: "importer-settings",
                text: "Settings",
              }}
              actions={
                <>
                  <Button variant="secondary" onClick={fillDemoSettings}>
                    Fill demo settings
                  </Button>
                </>
              }
            />
          }
        >
          <HookFormPFTextInput
            control={control}
            name="source"
            label="Source"
            fieldId="source"
            isRequired
          />

          <FormGroup label="Period" isRequired>
            <Split hasGutter>
              <SplitItem>
                <HookFormPFGroupController
                  control={control}
                  name="periodValue"
                  fieldId="periodValue"
                  renderInput={({ field: { value, onChange } }) => (
                    <NumberInput
                      value={value}
                      onMinus={() => {
                        onChange(value - 1);
                      }}
                      onChange={onChange}
                      onPlus={() => {
                        onChange(value + 1);
                      }}
                      inputName="periodValue"
                      inputAriaLabel="period value"
                      minusBtnAriaLabel="minus"
                      plusBtnAriaLabel="plus"
                    />
                  )}
                />
              </SplitItem>
              <SplitItem>
                <HookFormPFGroupController
                  control={control}
                  name="periodUnit"
                  fieldId="periodUnit"
                  renderInput={({ field: { value, onChange, onBlur } }) => (
                    <FormSelect
                      aria-label="period-unit"
                      isRequired
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      style={{ width: 110 }}
                    >
                      {ALL_PERIOD_UNITS.map((option, index) => (
                        <FormSelectOption
                          key={index}
                          value={option}
                          label={PERIOD_UNIT_LIST[option].label}
                        />
                      ))}
                    </FormSelect>
                  )}
                />
              </SplitItem>
            </Split>
          </FormGroup>

          <HookFormPFGroupController
            control={control}
            name="v3Signatures"
            fieldId="v3Signatures"
            renderInput={({ field: { value, onChange } }) => (
              <span>
                <Switch
                  id="v3Signatures"
                  label="Enable v3 signatures"
                  aria-label="v3 signature"
                  isChecked={value}
                  onChange={(_, checked) => {
                    onChange(checked);
                  }}
                />
                <Popover
                  position={PopoverPosition.top}
                  aria-label="v3 signature"
                  bodyContent="Enables v3 signatures"
                  className="popover"
                >
                  <span className={`${spacing.mlSm} pf-v6-c-icon pf-m-info`}>
                    <QuestionCircleIcon />
                  </span>
                </Popover>
              </span>
            )}
          />

          <FormGroup label="Keys" isRequired fieldId="keys">
            <Stack hasGutter>
              {fieldsKeys.map((field, index) => {
                return (
                  <StackItem key={field.id}>
                    <Split hasGutter>
                      <SplitItem isFilled>
                        <HookFormPFGroupController
                          control={control}
                          name={`keys.${index}.value`}
                          fieldId={`keys.${index}.value`}
                          renderInput={({
                            field: { value, onChange, onBlur },
                          }) => (
                            <TextInput
                              onChange={(_, value) => {
                                onChange(value);
                              }}
                              onBlur={onBlur}
                              value={value}
                            />
                          )}
                        />
                      </SplitItem>
                      <SplitItem>
                        <Button
                          icon={<MinusIcon />}
                          variant="tertiary"
                          onClick={() => {
                            removeKeys(index);
                          }}
                        >
                          Remove
                        </Button>
                      </SplitItem>
                    </Split>
                  </StackItem>
                );
              })}
              <StackItem>
                <Button
                  icon={<PlusCircleIcon />}
                  variant="tertiary"
                  onClick={() => appendKeys({ value: "" })}
                >
                  Add Key
                </Button>
              </StackItem>
            </Stack>
          </FormGroup>
        </FormFieldGroupExpandable>

        <ActionGroup>
          <Button
            type="submit"
            aria-label="submit"
            id="source-form-submit"
            variant={ButtonVariant.primary}
            isDisabled={!isValid || isSubmitting || isValidating || !isDirty}
          >
            {!importer ? "Create" : "Save"}
          </Button>
          <Button
            type="button"
            id="cancel"
            aria-label="cancel"
            variant={ButtonVariant.link}
            isDisabled={isSubmitting || isValidating}
            onClick={onClose}
          >
            Cancel
          </Button>
        </ActionGroup>
      </Form>
    </>
  );
};
