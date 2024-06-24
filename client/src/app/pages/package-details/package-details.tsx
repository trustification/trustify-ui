import React from "react";
import { Link } from "react-router-dom";

import {
  Breadcrumb,
  BreadcrumbItem,
  PageSection,
  Text,
  TextContent,
} from "@patternfly/react-core";

import DetailsPage from "@patternfly/react-component-groups/dist/dynamic/DetailsPage";

import { PathParam, useRouteParams } from "@app/Routes";
import { LoadingWrapper } from "@app/components/LoadingWrapper";
import { useFetchPackageById } from "@app/queries/packages";
import { decomposePurl } from "@app/utils/utils";

import { SbomsByPackage } from "./sboms-by-package";

export const PackageDetails: React.FC = () => {
  const packageId = useRouteParams(PathParam.PACKAGE_ID);

  const {
    pkg,
    isFetching: isFetchingSbom,
    fetchError: fetchErrorSbom,
  } = useFetchPackageById(packageId);

  const decomposedPurl = React.useMemo(() => {
    return pkg ? decomposePurl(pkg.purl) : undefined;
  }, [pkg]);

  return (
    <>
      <PageSection variant="light">
        <DetailsPage
          breadcrumbs={
            <Breadcrumb>
              <BreadcrumbItem key="packages">
                <Link to="/packages">Packages</Link>
              </BreadcrumbItem>
              <BreadcrumbItem isActive>Package details</BreadcrumbItem>
            </Breadcrumb>
          }
          pageHeading={{
            title: decomposedPurl?.name ?? packageId ?? "",
            iconAfterTitle: pkg ? (
              <TextContent>
                <Text component="pre">{`version: ${decomposedPurl?.version}`}</Text>
              </TextContent>
            ) : undefined,
            label: pkg
              ? {
                children: pkg ? `type=${decomposedPurl?.type}` : "",
                isCompact: true,
              }
              : undefined,
          }}
          actionButtons={[]}
          tabs={[
            {
              eventKey: "cves",
              title: "CVEs",
              children: (
                <div className="pf-v5-u-m-md">
                  <LoadingWrapper
                    isFetching={isFetchingSbom}
                    fetchError={fetchErrorSbom}
                  >
                    {/* {pkg && <RelatedCVEs cves={pkg?.related_cves || []} />} */}
                    <p style={{ color: "red" }}>issue-412</p>
                  </LoadingWrapper>
                </div>
              ),
            },
            {
              eventKey: "sboms",
              title: "SBOMs",
              children: (
                <div className="pf-v5-u-m-md">
                  <LoadingWrapper
                    isFetching={isFetchingSbom}
                    fetchError={fetchErrorSbom}
                  >
                    {packageId && <SbomsByPackage packageId={packageId} />}
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
