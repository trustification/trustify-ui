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
  } = useFetchImporterReports(importer.name, {
    page: { pageNumber: 1, itemsPerPage: 1 },
    sort: {
      field: "creation",
      direction: "asc",
    },
  });

  return <>{children({ reports, isFetching, fetchError })}</>;
};
