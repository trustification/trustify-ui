import React from "react";

import { useFetchPackagesBySbomId } from "@app/queries/sboms";

export interface IPackagesCountProps {
  sbomId: string | number;
}

export const PackagesCount: React.FC<IPackagesCountProps> = ({ sbomId }) => {
  const {
    result: { total },
  } = useFetchPackagesBySbomId(sbomId, {
    page: { pageNumber: 1, itemsPerPage: 1 },
  });

  return <>{total}</>;
};
