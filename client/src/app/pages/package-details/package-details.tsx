import React from "react";
import { Link } from "react-router-dom";

import {
  Breadcrumb,
  BreadcrumbItem,
  PageSection,
  Popover,
  TabAction,
  Text,
  TextContent,
} from "@patternfly/react-core";
import HelpIcon from "@patternfly/react-icons/dist/esm/icons/help-icon";

import DetailsPage from "@patternfly/react-component-groups/dist/dynamic/DetailsPage";

import { PathParam, useRouteParams } from "@app/Routes";
import { useFetchPackageById } from "@app/queries/packages";
import { decomposePurl } from "@app/utils/utils";

import { SbomsByPackage } from "./sboms-by-package";
import { VulnerabilitiesByPackage } from "./vulnerabilities-by-package";

export const PackageDetails: React.FC = () => {
  const packageId = useRouteParams(PathParam.PACKAGE_ID);
  const { pkg } = useFetchPackageById(packageId);

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
              eventKey: "vulnerabilities",
              title: "Vulnerabilities",
              children: (
                <div className="pf-v5-u-m-md">
                  {packageId && (
                    <VulnerabilitiesByPackage packageId={packageId} />
                  )}
                </div>
              ),
              actions: (
                <>
                  <Popover
                    bodyContent={
                      <div>
                        Vulnerabilities <strong>associated</strong> to the
                        current package.
                      </div>
                    }
                    position="top"
                  >
                    <TabAction>
                      <HelpIcon />
                    </TabAction>
                  </Popover>
                </>
              ),
            },
            {
              eventKey: "sboms",
              title: "SBOMs",
              children: (
                <div className="pf-v5-u-m-md">
                  {packageId && <SbomsByPackage packageId={packageId} />}
                </div>
              ),
              actions: (
                <>
                  <Popover
                    bodyContent={
                      <div>
                        SBOMs that <strong>contain</strong> the current package.
                      </div>
                    }
                    position="top"
                  >
                    <TabAction>
                      <HelpIcon />
                    </TabAction>
                  </Popover>
                </>
              ),
            },
          ]}
        />
      </PageSection>
    </>
  );
};
