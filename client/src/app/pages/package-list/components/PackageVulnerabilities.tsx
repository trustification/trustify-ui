import React from "react";

import { Label, Skeleton } from "@patternfly/react-core";

import { LoadingWrapper } from "@app/components/LoadingWrapper";
import { VulnerabilityGallery } from "@app/components/VulnerabilityGallery";
import { usePackageVulnerabilities } from "@app/hooks/domain-controls/usePackageVulnerabilities";

interface PackageVulnerabilitiesProps {
  packageId: string;
}

export const PackageVulnerabilities: React.FC<PackageVulnerabilitiesProps> = ({
  packageId,
}) => {
  const { summary, isFetching, fetchError } =
    usePackageVulnerabilities(packageId);

  return (
    <LoadingWrapper
      isFetching={isFetching}
      fetchError={fetchError}
      isFetchingState={<Skeleton screenreaderText="Loading contents" />}
      fetchErrorState={<Label color="red">Error</Label>}
    >
      <VulnerabilityGallery severities={summary.severities} />
    </LoadingWrapper>
  );
};
