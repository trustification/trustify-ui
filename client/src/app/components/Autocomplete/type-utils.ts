export interface GroupedAutocompleteOptionProps {
  uniqueId: string;

  name: string | (() => string);
  labelName?: string | (() => string);

  tooltip?: string | (() => string);

  group?: string;
}

export interface GroupMap {
  [key: string]: GroupedAutocompleteOptionProps[];
}
