import React from "react";
import { Link } from "react-router-dom";

import {
  Breadcrumb,
  BreadcrumbItem,
  PageSection,
} from "@patternfly/react-core";

import DetailsPage from "@patternfly/react-component-groups/dist/dynamic/DetailsPage";
import DownloadIcon from "@patternfly/react-icons/dist/esm/icons/download-icon";

import { PathParam, useRouteParams } from "@app/Routes";

import { LoadingWrapper } from "@app/components/LoadingWrapper";
import { useDownload } from "@app/hooks/useDownload";
import { useFetchSBOMById } from "@app/queries/sboms";

import { Overview } from "./overview";
import { PackagesBySbom } from "./packages-by-sbom";
import { VulnerabilitiesBySbom } from "./vulnerabilities-by-sbom";
import { AIAssistant } from "../../components/ai-assistant";

export const SbomDetails: React.FC = () => {
  const sbomId = useRouteParams(PathParam.SBOM_ID);

  const { sbom, isFetching, fetchError } = useFetchSBOMById(sbomId);

  const { downloadSBOM } = useDownload();

  return (
    <>
      <AIAssistant
        viewing={`the details for SBOM uuid: ${sbom?.id}, name: ${sbom?.name}`}
      />

      <PageSection variant="light">
        <DetailsPage
          breadcrumbs={
            <Breadcrumb>
              <BreadcrumbItem key="advisories">
                <Link to="/sboms">SBOMs</Link>
              </BreadcrumbItem>
              <BreadcrumbItem isActive>SBOM details</BreadcrumbItem>
            </Breadcrumb>
          }
          pageHeading={{
            title: sbom?.name ?? sbomId ?? "",
          }}
          actionButtons={[
            {
              children: (
                <>
                  <DownloadIcon /> Download
                </>
              ),
              onClick: () => {
                if (sbomId) {
                  downloadSBOM(
                    sbomId,
                    sbom?.name ? `${sbom?.name}.json` : sbomId
                  );
                }
              },
              variant: "secondary",
            },
          ]}
          tabs={[
            {
              eventKey: "overview",
              title: "Overview",
              children: (
                <div className="pf-v5-u-m-md">
                  <LoadingWrapper
                    isFetching={isFetching}
                    fetchError={fetchError}
                  >
                    {sbom && <Overview sbom={sbom} />}
                  </LoadingWrapper>
                </div>
              ),
            },
            {
              eventKey: "vulnerabilities",
              title: "Vulnerabilities",
              children: (
                <div className="pf-v5-u-m-md">
                  {sbomId && <VulnerabilitiesBySbom sbomId={sbomId} />}
                </div>
              ),
            },
            {
              eventKey: "packages",
              title: "Packages",
              children: (
                <div className="pf-v5-u-m-md">
                  {sbomId && <PackagesBySbom sbomId={sbomId} />}
                </div>
              ),
            },
          ]}
        />
      </PageSection>
    </>
  );
};
