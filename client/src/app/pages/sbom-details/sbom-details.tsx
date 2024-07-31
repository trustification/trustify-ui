import React from "react";
import { Link } from "react-router-dom";

import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  CardBody,
  CardExpandableContent,
  CardHeader,
  CardTitle,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Divider,
  Grid,
  GridItem,
  PageSection,
  Stack,
  StackItem,
  Tab,
  Tabs,
  TabTitleText,
  TextContent,
  Title,
} from "@patternfly/react-core";
import { ChartDonut, ChartThemeColor } from "@patternfly/react-charts";

import DetailsPage from "@patternfly/react-component-groups/dist/dynamic/DetailsPage";
import DownloadIcon from "@patternfly/react-icons/dist/esm/icons/download-icon";

import { PathParam, useRouteParams } from "@app/Routes";

import { useDownload } from "@app/hooks/useDownload";
import { useFetchSBOMById } from "@app/queries/sboms";

import { PackagesBySbom } from "./packages-by-sbom";
import { VulnerabilitiesBySbom } from "./vulnerabilities-by-sbom";
import { PageDrawerContent } from "@app/components/PageDrawerContext";
import { formatDate } from "@app/utils/utils";
import { LabelsAsList } from "@app/components/LabelsAsList";

export const SbomDetails: React.FC = () => {
  const sbomId = useRouteParams(PathParam.SBOM_ID);

  const { sbom, isFetching, fetchError } = useFetchSBOMById(sbomId);

  const [isExpanded, setIsExpanded] = React.useState<boolean>(true);

  const { downloadSBOM } = useDownload();

  return (
    <>
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
          tabs={
            [
              // {
              //   eventKey: "overview",
              //   title: "Overview",
              //   children: (
              //     <div className="pf-v5-u-m-md">
              //       <LoadingWrapper
              //         isFetching={isFetching}
              //         fetchError={fetchError}
              //       >
              //         {sbom && <Overview sbom={sbom} />}
              //       </LoadingWrapper>
              //     </div>
              //   ),
              // },
              // {
              //   eventKey: "packages",
              //   title: "Packages",
              //   children: (
              //     <div className="pf-v5-u-m-md">
              //       {sbomId && <PackagesBySbom sbomId={sbomId} />}
              //     </div>
              //   ),
              // },
              // {
              //   eventKey: "vulnerabilities",
              //   title: "Vulnerabilities",
              //   children: (
              //     <div className="pf-v5-u-m-md">
              //       {sbomId && <VulnerabilitiesBySbom sbomId={sbomId} />}
              //     </div>
              //   ),
              // },
            ]
          }
        />
      </PageSection>
      <PageSection>
        {/* <Stack hasGutter>
          <Stack>
            <Card id="expandable-card" isExpanded={isExpanded}>
              <CardHeader
                onExpand={() => {
                  setIsExpanded(!isExpanded);
                }}
                isToggleRightAligned
              >
                <CardTitle id="expandable-card-title">Overview</CardTitle>
              </CardHeader>
              <CardExpandableContent>
                <CardBody>
                  <Grid hasGutter>
                    <GridItem md={4}>
                      <div style={{ height: "230px", width: "350px" }}>
                        <ChartDonut
                          ariaDesc="Average number of pets"
                          ariaTitle="Donut chart example"
                          constrainToVisibleArea
                          data={[
                            { x: "Critical", y: 35 },
                            { x: "High", y: 35 },
                            { x: "Medium", y: 55 },
                            { x: "Low", y: 10 },
                            { x: "None", y: 10 },
                          ]}
                          labels={({ datum }) => `${datum.x}: ${datum.y}%`}
                          legendData={[
                            { name: "Critial: 35" },
                            { name: "High: 55" },
                            { name: "Medium: 55" },
                            { name: "Low: 10" },
                            { name: "None: 10" },
                          ]}
                          legendOrientation="vertical"
                          legendPosition="right"
                          name="chart2"
                          padding={{
                            bottom: 20,
                            left: 20,
                            right: 140, // Adjusted to accommodate legend
                            top: 20,
                          }}
                          subTitle="Vuulnerabilities"
                          title="165"
                          width={350}
                          themeColor={ChartThemeColor.orange}
                        />
                      </div>
                    </GridItem>
                    <GridItem md={8}>
                      <DescriptionList>
                        <DescriptionListGroup>
                          <DescriptionListTerm>Name</DescriptionListTerm>
                          <DescriptionListDescription>
                            {sbom?.name}
                          </DescriptionListDescription>
                        </DescriptionListGroup>
                        <DescriptionListGroup>
                          <DescriptionListTerm>Published</DescriptionListTerm>
                          <DescriptionListDescription>
                            {formatDate(sbom?.published)}
                          </DescriptionListDescription>
                        </DescriptionListGroup>
                        <DescriptionListGroup>
                          <DescriptionListTerm>Authors</DescriptionListTerm>
                          <DescriptionListDescription>
                            {sbom?.authors}
                          </DescriptionListDescription>
                        </DescriptionListGroup>
                      </DescriptionList>
                    </GridItem>
                  </Grid>
                </CardBody>
              </CardExpandableContent>
            </Card>
          </Stack>
          <StackItem>
            <Card>
              <CardBody>
                <Tabs
                  defaultActiveKey={0}
                  aria-label="Tabs in the uncontrolled example"
                  role="region"
                >
                  <Tab
                    eventKey={0}
                    title={<TabTitleText>Packages</TabTitleText>}
                    aria-label="Uncontrolled ref content - users"
                  >
                    {sbomId && <PackagesBySbom sbomId={sbomId} />}
                  </Tab>
                  <Tab
                    eventKey={1}
                    title={<TabTitleText>Vulnerabilities</TabTitleText>}
                  >
                    Containers
                  </Tab>
                </Tabs>
              </CardBody>
            </Card>
          </StackItem>
        </Stack> */}

        <Grid hasGutter>
          <GridItem md={3}>
            <Card isFullHeight>
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardBody>
                <Stack hasGutter>
                  <StackItem>
                    <div style={{ height: "230px", width: "350px" }}>
                      <ChartDonut
                        ariaDesc="Average number of pets"
                        ariaTitle="Donut chart example"
                        constrainToVisibleArea
                        data={[
                          { x: "Critical", y: 35 },
                          { x: "High", y: 35 },
                          { x: "Medium", y: 55 },
                          { x: "Low", y: 10 },
                          { x: "None", y: 10 },
                        ]}
                        labels={({ datum }) => `${datum.x}: ${datum.y}%`}
                        legendData={[
                          { name: "Critical: 35" },
                          { name: "High: 55" },
                          { name: "Medium: 55" },
                          { name: "Low: 10" },
                          { name: "None: 10" },
                        ]}
                        legendOrientation="vertical"
                        legendPosition="right"
                        name="chart2"
                        padding={{
                          bottom: 20,
                          left: 20,
                          right: 140, // Adjusted to accommodate legend
                          top: 20,
                        }}
                        subTitle="Vuulnerabilities"
                        title="165"
                        width={350}
                        themeColor={ChartThemeColor.orange}
                      />
                    </div>
                  </StackItem>
                  <StackItem>
                    <DescriptionList>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Name</DescriptionListTerm>
                        <DescriptionListDescription>
                          {sbom?.name}
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Published</DescriptionListTerm>
                        <DescriptionListDescription>
                          {formatDate(sbom?.published)}
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Authors</DescriptionListTerm>
                        <DescriptionListDescription>
                          {sbom?.authors}
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                    </DescriptionList>
                  </StackItem>
                </Stack>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem md={9}>
            <Card>
              <CardBody>
                <Tabs
                  defaultActiveKey={0}
                  aria-label="Tabs in the uncontrolled example"
                  role="region"
                >
                  <Tab
                    eventKey={0}
                    title={<TabTitleText>Packages</TabTitleText>}
                    aria-label="Uncontrolled ref content - users"
                  >
                    {sbomId && <PackagesBySbom sbomId={sbomId} />}
                  </Tab>
                  <Tab
                    eventKey={1}
                    title={<TabTitleText>Vulnerabilities</TabTitleText>}
                  >
                    Containers
                  </Tab>
                </Tabs>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </PageSection>
    </>
  );
};
