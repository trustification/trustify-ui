import type React from "react";

import { Bullseye, Spinner } from "@patternfly/react-core";
import { Tbody, Td, Tr } from "@patternfly/react-table";

import { StateError } from "../StateError";
import { StateNoData } from "../StateNoData";

export interface IConditionalDataListBodyProps {
  numRenderedColumns: number;
  isLoading?: boolean;
  isError?: boolean;
  isNoData?: boolean;
  errorEmptyState?: React.ReactNode;
  noDataEmptyState?: React.ReactNode;
  children: React.ReactNode;
}

export const ConditionalDataListBody: React.FC<IConditionalDataListBodyProps> = ({
  numRenderedColumns,
  isLoading = false,
  isError = false,
  isNoData = false,
  errorEmptyState = null,
  noDataEmptyState = null,
  children,
}) => (
  <>
    {children}
  </>
);
