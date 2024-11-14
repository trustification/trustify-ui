import React from "react";

import { useFetchPackagesBySbomId } from "@app/queries/packages";

export interface IPackagesCountProps {
  sbomId: string;
}

export const PackagesCount: React.FC<IPackagesCountProps> = ({ sbomId }) => {
  const {
    result: { total },
  } = useFetchPackagesBySbomId(sbomId, {
    page: { pageNumber: 1, itemsPerPage: 1 },
  });

  return <>{total}</>;
};
