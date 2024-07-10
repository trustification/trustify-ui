import React from "react";
import { Link } from "react-router-dom";

import DetailsPage from "@patternfly/react-component-groups/dist/dynamic/DetailsPage";
import {
  Breadcrumb,
  BreadcrumbItem,
  PageSection,
} from "@patternfly/react-core";
import DownloadIcon from "@patternfly/react-icons/dist/esm/icons/download-icon";

import { PathParam, useRouteParams } from "@app/Routes";
import { AdvisorySourceViewer } from "@app/components/AdvisorySourceViewer";
import { LoadingWrapper } from "@app/components/LoadingWrapper";
import { SeverityShieldAndText } from "@app/components/SeverityShieldAndText";
import { useDownload } from "@app/hooks/useDownload";
import { useFetchAdvisoryById } from "@app/queries/advisories";

import { Overview } from "./overview";
import { Vulnerabilities } from "./vulnerabilities";

export const AdvisoryDetails: React.FC = () => {
  const advisoryId = useRouteParams(PathParam.ADVISORY_ID);
  const { advisory, isFetching, fetchError } = useFetchAdvisoryById(advisoryId);

  const { downloadAdvisory } = useDownload();

  return (
    <>
      <PageSection variant="light">
        <DetailsPage
          breadcrumbs={
            <Breadcrumb>
              <BreadcrumbItem key="advisories">
                <Link to="/advisories">Advisories</Link>
              </BreadcrumbItem>
              <BreadcrumbItem isActive>Advisory details</BreadcrumbItem>
            </Breadcrumb>
          }
          actionButtons={[
            {
              children: (
                <>
                  <DownloadIcon /> Download
                </>
              ),
              variant: "secondary",
              onClick: () => {
                if (advisoryId) {
                  downloadAdvisory(advisoryId, `${advisory?.identifier}.json`);
                }
              },
            },
          ]}
          pageHeading={{
            title: advisory?.identifier ?? "",
            label: advisory?.average_severity
              ? {
                  children: (
                    <SeverityShieldAndText value={advisory.average_severity} />
                  ),
                  isCompact: true,
                }
              : undefined,
          }}
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
                    {advisory && <Overview advisory={advisory} />}
                  </LoadingWrapper>
                </div>
              ),
            },
            {
              eventKey: "vulnerabilities",
              title: "Vulnerabilities",
              children: (
                <div className="pf-v5-u-m-md">
                  <LoadingWrapper
                    isFetching={isFetching}
                    fetchError={fetchError}
                  >
                    <Vulnerabilities
                      enableToolbar
                      vulnerabilities={advisory?.vulnerabilities || []}
                    />
                  </LoadingWrapper>
                </div>
              ),
            },
            {
              eventKey: "source",
              title: "Source",
              children: (
                <div className="pf-v5-u-m-md">
                  {advisoryId && (
                    <AdvisorySourceViewer
                      advisoryId={advisoryId}
                      height="645px"
                    />
                  )}
                </div>
              ),
            },
          ]}
        />
      </PageSection>
    </>
  );
};
