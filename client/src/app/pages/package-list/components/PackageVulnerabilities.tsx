import type React from "react";

import { Skeleton } from "@patternfly/react-core";

import { LoadingWrapper } from "@app/components/LoadingWrapper";
import { TableCellError } from "@app/components/TableCellError";
import { VulnerabilityGallery } from "@app/components/VulnerabilityGallery";
import { useVulnerabilitiesOfPackage } from "@app/hooks/domain-controls/useVulnerabilitiesOfPackage";

interface PackageVulnerabilitiesProps {
  packageId: string;
}

export const PackageVulnerabilities: React.FC<PackageVulnerabilitiesProps> = ({
  packageId,
}) => {
  const { data, isFetching, fetchError } =
    useVulnerabilitiesOfPackage(packageId);

  return (
    <LoadingWrapper
      isFetching={isFetching}
      fetchError={fetchError}
      isFetchingState={<Skeleton screenreaderText="Loading contents" />}
      fetchErrorState={(error) => <TableCellError error={error} />}
    >
      <VulnerabilityGallery
        severities={data.summary.vulnerabilityStatus.affected.severities}
      />
    </LoadingWrapper>
  );
};
