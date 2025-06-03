import type { SelectOptionProps } from "@patternfly/react-core";

export interface AutocompleteOptionProps {
  uniqueId: string;

  name: string | (() => string);
  labelName?: string | (() => string);

  tooltip?: string | (() => string);

  optionProps?: SelectOptionProps;
}
