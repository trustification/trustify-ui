import type * as React from "react";
import type { FieldValues, Path } from "react-hook-form";

import { getValidatedFromErrors } from "@app/utils/utils";
import { FormSelect, type FormSelectProps } from "@patternfly/react-core";

import {
  type BaseHookFormPFGroupControllerProps,
  HookFormPFGroupController,
  extractGroupControllerProps,
} from "./HookFormPFGroupController";

export type HookFormPFSelectProps<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
> = FormSelectProps &
  BaseHookFormPFGroupControllerProps<TFieldValues, TName> & {
    children: React.ReactNode;
  };

export const HookFormPFSelect = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>,
>(
  props: HookFormPFSelectProps<TFieldValues, TName>,
) => {
  const { extractedProps, remainingProps } = extractGroupControllerProps<
    TFieldValues,
    TName,
    HookFormPFSelectProps<TFieldValues, TName>
  >(props);
  const { fieldId, helperText, isRequired, errorsSuppressed } = extractedProps;
  const { children: _children, ref: _ref, ...rest } = remainingProps;

  return (
    <HookFormPFGroupController<TFieldValues, TName>
      {...extractedProps}
      renderInput={({
        field: { onChange, onBlur, value, name, ref },
        fieldState: { isDirty, error, isTouched },
      }) => (
        <FormSelect
          ref={ref}
          name={name}
          id={fieldId}
          aria-describedby={helperText ? `${fieldId}-helper` : undefined}
          isRequired={isRequired}
          onChange={onChange}
          onBlur={onBlur}
          value={value}
          validated={
            errorsSuppressed
              ? "default"
              : getValidatedFromErrors(error, isDirty, isTouched)
          }
          {...rest}
        >
          {props.children}
        </FormSelect>
      )}
    />
  );
};
