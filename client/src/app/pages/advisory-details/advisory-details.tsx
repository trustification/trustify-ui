import React from "react";
import { Link } from "react-router-dom";

import {
  Breadcrumb,
  BreadcrumbItem,
  PageSection,
} from "@patternfly/react-core";

import DetailsPage from "@patternfly/react-component-groups/dist/dynamic/DetailsPage";

import { PathParam, useRouteParams } from "@app/Routes";
import { LoadingWrapper } from "@app/components/LoadingWrapper";

import { useFetchAdvisoryById } from "@app/queries/advisories";

import { Overview } from "./overview";
import { Vulnerabilities } from "./vulnerabilities";

export const AdvisoryDetails: React.FC = () => {
  const advisoryId = useRouteParams(PathParam.ADVISORY_ID);
  const { advisory, isFetching, fetchError } = useFetchAdvisoryById(advisoryId);

  return (
    <>
      <PageSection variant="light">
        <DetailsPage
          breadcrumbs={
            <Breadcrumb>
              <BreadcrumbItem key="advisories">
                <Link to="/advisories">Advisories</Link>
              </BreadcrumbItem>
              <BreadcrumbItem to="#" isActive>
                Advisory details
              </BreadcrumbItem>
            </Breadcrumb>
          }
          pageHeading={{
            title: advisory?.identifier ?? "",
            // label: advisory
            //   ? {
            //       children: (
            //         <SeverityShieldAndText
            //           value={advisory.severity}
            //         />
            //       ),
            //       isCompact: true,
            //     }
            //   : undefined,
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
                      vulnerabilities={advisory?.vulnerabilities || []}
                    />
                  </LoadingWrapper>
                </div>
              ),
            },
          ]}
        />
      </PageSection>
    </>
  );
};
