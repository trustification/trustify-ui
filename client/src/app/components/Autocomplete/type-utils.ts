import type { SelectOptionProps } from "@patternfly/react-core";

export interface AutocompleteOptionProps {
  id: string;

  name: string | (() => string);
  labelName?: string | (() => string);

  tooltip?: string | (() => string);

  optionProps?: SelectOptionProps;
}
