import React from "react";

import { useFetchSbomsByPackageId } from "@app/queries/sboms";

export interface ISbomsByPackageCountProps {
  packageId: string;
}

export const SbomsByPackageCount: React.FC<ISbomsByPackageCountProps> = ({
  packageId,
}) => {
  const {
    result: { total },
  } = useFetchSbomsByPackageId(packageId, {
    page: { pageNumber: 1, itemsPerPage: 1 },
  });

  return <>{total}</>;
};
