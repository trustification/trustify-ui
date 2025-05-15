import type React from "react";

import type { AxiosError } from "axios";

import { Label } from "@patternfly/react-core";

interface TableCellErrorProps {
  error: AxiosError;
}

export const TableCellError: React.FC<TableCellErrorProps> = ({ error }) => {
  return <Label color="red">{error.status} Error</Label>;
};
