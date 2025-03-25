import type React from "react";

import { Th } from "@patternfly/react-table";

export interface ITableHeaderContentWithControlsProps {
  numColumnsBeforeData: number;
  numColumnsAfterData: number;
  children: React.ReactNode;
}

export const TableHeaderContentWithControls: React.FC<
  ITableHeaderContentWithControlsProps
> = ({ numColumnsBeforeData, numColumnsAfterData, children }) => (
  <>
    {Array(numColumnsBeforeData)
      .fill(null)
      .map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: deterministic index
        <Th screenReaderText={`before-data-${i}`} key={i} />
      ))}
    {children}
    {Array(numColumnsAfterData)
      .fill(null)
      .map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: deterministic index
        <Th screenReaderText={`after-data-${i}`} key={i} />
      ))}
  </>
);
