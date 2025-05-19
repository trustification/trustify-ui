import type React from "react";

import type { AxiosError } from "axios";

import type { Importer, PaginatedResultsImporterReport } from "@app/client";
import { useFetchImporterReports } from "@app/queries/importers";

type ChildrenProps = {
  reports: PaginatedResultsImporterReport["items"];
  isFetching: boolean;
  fetchError: AxiosError;
};

export interface WatchImporterReportProps {
  importer: Importer;
  children: (props: ChildrenProps) => React.ReactNode;
}

export const WatchImporterReport: React.FC<WatchImporterReportProps> = ({
  importer,
  children,
}) => {
  const {
    result: { data: reports },
    isFetching,
    fetchError,
  } = useFetchImporterReports(importer.name);

  return <>{children({ reports, isFetching, fetchError })}</>;
};
