import type React from "react";

import type { State } from "@app/client";
import { IconedStatus } from "@app/components/IconedStatus";

export interface ImporterStatusIconProps {
  state: State;
}

export type AnalysisState =
  | "Canceled"
  | "Scheduled"
  | "Completed"
  | "Failed"
  | "InProgress"
  | "NotStarted";

const importerStateToAnalyze: Map<State, AnalysisState> = new Map([
  ["waiting", "Scheduled"],
  ["running", "InProgress"],
]);

export const ImporterStatusIcon: React.FC<ImporterStatusIconProps> = ({
  state,
}) => {
  const getImporterStatus = (state: State): AnalysisState => {
    if (importerStateToAnalyze.has(state)) {
      const value = importerStateToAnalyze.get(state);
      if (value) return value;
    }
    return "NotStarted";
  };

  return <IconedStatus preset={getImporterStatus(state)} />;
};
