import type React from "react";

import { Skeleton } from "@patternfly/react-core";

import { LoadingWrapper } from "@app/components/LoadingWrapper";
import { TableCellError } from "@app/components/TableCellError";
import { VulnerabilityGallery } from "@app/components/VulnerabilityGallery";
import { useVulnerabilitiesOfSbom } from "@app/hooks/domain-controls/useVulnerabilitiesOfSbom";

interface SBOMVulnerabilitiesProps {
  sbomId: string;
}

export const SBOMVulnerabilities: React.FC<SBOMVulnerabilitiesProps> = ({
  sbomId,
}) => {
  const { data, isFetching, fetchError } = useVulnerabilitiesOfSbom(sbomId);

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
