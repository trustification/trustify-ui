import React, { useContext } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { boolean, number, object, string } from "yup";

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
  Switch,
} from "@patternfly/react-core";
import { QuestionCircleIcon } from "@patternfly/react-icons";
import spacing from "@patternfly/react-styles/css/utilities/Spacing/spacing";

import { Importer, ImporterConfigurationValues } from "@app/api/models";
import {
  useCreateImporterMutation,
  useUpdateImporterMutation,
} from "@app/queries/importers";

import {
  HookFormPFGroupController,
  HookFormPFSelect,
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

export const ALL_IMPORTER_TYPES = ["sbom", "csaf"] as const;
type ImporterType = (typeof ALL_IMPORTER_TYPES)[number];

export interface FormValues {
  name: string;
  type: ImporterType;
  source: string;
  periodValue: number;
  periodUnit: PeriodUnitType;
  v3Signatures: boolean;
  enabled: boolean;
}

export interface IImporterFormProps {
  importer?: Importer;
  onClose: () => void;
}

export const ImporterForm: React.FC<IImporterFormProps> = ({
  importer,
  onClose,
}) => {
  const { pushNotification } = useContext(NotificationsContext);

  const validationSchema = object().shape({
    name: string().trim().required().min(3).max(120),
    type: string().trim().required().min(3).max(250),
    source: string().trim().required().min(3).max(250),
    periodValue: number().required().min(1),
    periodUnit: string().trim().required().max(250),
    v3Signatures: boolean().required(),
    enabled: boolean().required(),
  });

  const importerConfiguration =
    importer?.configuration.sbom || importer?.configuration.csaf;
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
      type: importer?.configuration.sbom
        ? "sbom"
        : importer?.configuration.csaf
          ? "csaf"
          : "csaf",
      source: importerConfiguration?.source || "",
      periodValue: periodValue || 60,
      periodUnit: periodUnit || "s",
      v3Signatures:
        importerConfiguration?.v3Signatures !== undefined &&
        importerConfiguration?.v3Signatures !== null
          ? importerConfiguration?.v3Signatures
          : false,
      enabled:
        importerConfiguration?.disabled !== undefined &&
        importerConfiguration?.disabled !== null
          ? !importerConfiguration?.disabled
          : true,
    },
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const onCreateSuccess = (_: Importer) =>
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

  const onUpdateSuccess = (_: Importer) =>
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
    const configuration: ImporterConfigurationValues = {
      ...importerConfiguration!,
      source: formValues.source.trim(),
      period: `${formValues.periodValue}${formValues.periodUnit.trim()}`,
      v3Signatures: formValues.v3Signatures,
      disabled: !formValues.enabled,
    };
    const payload: Importer = {
      name: formValues.name.trim(),
      configuration: {
        [formValues.type]: configuration,
      },
    };
    if (importer) {
      updateImporter(payload);
    } else {
      createImporter(payload);
    }
    onClose();
  };

  const fillDemoSettings = () => {
    if (getValues().type === "sbom") {
      setValue("source", "https://access.redhat.com/security/data/sbom/beta/");
    } else if (getValues().type === "csaf") {
      setValue(
        "source",
        "https://redhat.com/.well-known/csaf/provider-metadata.json"
      );
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
          {ALL_IMPORTER_TYPES.map((option, index) => (
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
                <span className={`${spacing.mlSm} pf-v5-c-icon pf-m-info`}>
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
                  <span className={`${spacing.mlSm} pf-v5-c-icon pf-m-info`}>
                    <QuestionCircleIcon />
                  </span>
                </Popover>
              </span>
            )}
          />
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
