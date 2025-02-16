import React from "react";

import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTermHelpText,
  DescriptionListTermHelpTextButton,
  Gallery,
  Grid,
  GridItem,
  Icon,
  Label,
  PageSection,
  PageSectionVariants,
  Popover,
  Split,
  SplitItem,
  Stack,
  StackItem,
  Text,
  TextContent,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "@patternfly/react-core";

import {
  Chart,
  ChartAxis,
  ChartBar,
  ChartStack,
  ChartThemeColor,
  ChartTooltip,
} from "@patternfly/react-charts";
import {
  CircleNotchIcon,
  GithubIcon,
  RedhatIcon,
} from "@patternfly/react-icons";

import { severityList } from "@app/api/model-utils";
import { Severity } from "@app/client";
import { FilterToolbar, FilterType } from "@app/components/FilterToolbar";
import { SeverityShieldAndText } from "@app/components/SeverityShieldAndText";
import { SimplePagination } from "@app/components/SimplePagination";
import { useLocalTableControls } from "@app/hooks/table-controls";

interface Legend {
  severity: Severity;
}

const LEGENDS: Legend[] = [
  { severity: "critical" },
  { severity: "high" },
  { severity: "medium" },
  { severity: "low" },
  { severity: "none" },
];

interface Data {
  type: "sbom" | "vulnerability";
  name: string;
  description: string;
}

const sboms: Data[] = [...Array(5).keys()].map((item) => ({
  type: "sbom",
  name: `sbom-${item}`,
  description: `This is my SBOM ${item}`,
}));
const vulnerabilities: Data[] = [...Array(5).keys()].map((item) => ({
  type: "vulnerability",
  name: `CVE-${item}`,
  description: `Apache James MIME4J: Temporary File Information Disclosure in MIME4J TempFileStorageProvider`,
}));

export const SearchPage: React.FC = () => {
  const tableControls = useLocalTableControls({
    tableName: "search-table",
    idProperty: "name",
    items: [...sboms, ...vulnerabilities],
    columnNames: {
      name: "Name",
      type: "Type",
      description: "Description",
      source: "Source",
      period: "Period",
      state: "State",
    },
    hasActionsColumn: true,
    isSortEnabled: true,
    sortableColumns: ["name"],
    getSortValues: (item) => ({
      name: item.name,
    }),
    isPaginationEnabled: true,
    isExpansionEnabled: true,
    expandableVariant: "single",
    isFilterEnabled: true,
    filterCategories: [
      {
        categoryKey: "name",
        title: "Name",
        type: FilterType.search,
        placeholderText: "Search",
        getItemValue: (item) => item.name || "",
      },
    ],
  });

  const {
    currentPageItems,
    numRenderedColumns,
    propHelpers: {
      toolbarProps,
      filterToolbarProps,
      paginationToolbarItemProps,
      paginationProps,
      tableProps,
      getThProps,
      getTrProps,
      getTdProps,
    },
    expansionDerivedState: { isCellExpanded },
  } = tableControls;

  //
  const sbomHeader = (item: Data) => (
    <Label color="green" variant="outline" isCompact>
      SBOM
    </Label>
  );

  const vulnerabilityHeader = (item: Data) => (
    <Label color="purple" variant="outline" isCompact>
      Vulnerability
    </Label>
  );

  const sbomTitle = (item: Data) => (
    <Split>
      <SplitItem isFilled>{item.name}</SplitItem>
      <SplitItem>
        <Label isCompact>v8.1</Label>
      </SplitItem>
    </Split>
  );

  const vulnerabilityTitle = (item: Data) => (
    <Split>
      <SplitItem isFilled>{item.name}</SplitItem>
      <SplitItem>
        <SeverityShieldAndText value="medium" hideLabel />
      </SplitItem>
    </Split>
  );

  const sbomBody = (item: Data) => (
    <Stack hasGutter>
      <StackItem>{item.description}</StackItem>
      <StackItem>
        <DescriptionList isCompact>
          <DescriptionListGroup>
            <DescriptionListTermHelpText>
              <Popover
                headerContent={<div>Product</div>}
                bodyContent={<div>The product where this SBOM belongs to</div>}
              >
                <DescriptionListTermHelpTextButton>
                  Product
                </DescriptionListTermHelpTextButton>
              </Popover>
            </DescriptionListTermHelpText>
            <DescriptionListDescription>
              <Text component="a">RHEL</Text>
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </StackItem>
    </Stack>
  );

  const vulnerabilityBody = (item: Data) => <>{item.description}</>;

  const sbomFooter = (item: Data) => (
    <DescriptionList isCompact>
      <DescriptionListGroup>
        <DescriptionListTermHelpText>
          <Popover
            headerContent={<div>Vulnerabilities</div>}
            bodyContent={<div>Vulnerabilities affecting</div>}
          >
            <DescriptionListTermHelpTextButton>
              Vulnerabilities
            </DescriptionListTermHelpTextButton>
          </Popover>
        </DescriptionListTermHelpText>
        <DescriptionListDescription>
          <Grid>
            <GridItem md={4}>
              <TextContent>
                <Text component="p">
                  <Icon isInline status="danger" size="sm">
                    <RedhatIcon />
                  </Icon>{" "}
                  Red Hat
                </Text>
              </TextContent>
            </GridItem>
            <GridItem md={8}>{sbomVulnerabilities}</GridItem>

            <GridItem md={4}>
              <TextContent>
                <Text component="p">
                  <Icon isInline status="info" size="sm">
                    <GithubIcon />
                  </Icon>{" "}
                  GitHub
                </Text>
              </TextContent>
            </GridItem>
            <GridItem md={8}>{sbomVulnerabilities}</GridItem>

            <GridItem md={4}>
              <TextContent>
                <Text component="p">
                  <Icon isInline status="custom" size="sm">
                    <CircleNotchIcon />
                  </Icon>{" "}
                  OSV
                </Text>
              </TextContent>
            </GridItem>
            <GridItem md={8}>{sbomVulnerabilities}</GridItem>
          </Grid>
        </DescriptionListDescription>
      </DescriptionListGroup>
    </DescriptionList>
  );

  const vulnerabilityFooter = (item: Data) => (
    <DescriptionList isCompact>
      <DescriptionListGroup>
        <DescriptionListTermHelpText>
          <Popover
            headerContent={<div>Affected SBOMs</div>}
            bodyContent={<div>Additional name info</div>}
          >
            <DescriptionListTermHelpTextButton>
              SBOMs affected
            </DescriptionListTermHelpTextButton>
          </Popover>
        </DescriptionListTermHelpText>
        <DescriptionListDescription>
          <Grid>
            <GridItem md={10}>
              <TextContent>
                <Text component="p">
                  <Icon isInline status="danger" size="sm">
                    <RedhatIcon />
                  </Icon>{" "}
                  Red Hat
                </Text>
              </TextContent>
            </GridItem>
            <GridItem md={2}>
              <Text component="a">10</Text>
            </GridItem>

            <GridItem md={10}>
              <TextContent>
                <Text component="p">
                  <Icon isInline status="info" size="sm">
                    <GithubIcon />
                  </Icon>{" "}
                  GitHub
                </Text>
              </TextContent>
            </GridItem>
            <GridItem md={2}>
              <Text component="a">11</Text>
            </GridItem>

            <GridItem md={10}>
              <TextContent>
                <Text component="p">
                  <Icon isInline status="custom" size="sm">
                    <CircleNotchIcon />
                  </Icon>{" "}
                  OSV
                </Text>
              </TextContent>
            </GridItem>
            <GridItem md={2}>
              <Text component="a">12</Text>
            </GridItem>
          </Grid>
        </DescriptionListDescription>
      </DescriptionListGroup>
    </DescriptionList>
  );

  const sbomVulnerabilities = (
    <div style={{ height: "24px", width: "150px" }}>
      <Chart
        ariaDesc="Average number of pets"
        ariaTitle="Stack chart example"
        height={24}
        padding={{ left: 10 }}
        themeColor={ChartThemeColor.multiOrdered}
        width={150}
      >
        <ChartAxis />
        <ChartStack
          horizontal
          colorScale={LEGENDS.map((legend) => {
            const severity = severityList[legend.severity];
            return severity.color.value;
          })}
        >
          <ChartBar
            data={[
              {
                name: "Critical",
                x: " ",
                y: 3,
                label: "Critical: 3",
              },
            ]}
            labelComponent={<ChartTooltip constrainToVisibleArea />}
          />
          <ChartBar
            data={[
              {
                name: "High",
                x: " ",
                y: 3,
                label: "High: 3",
              },
            ]}
            labelComponent={<ChartTooltip constrainToVisibleArea />}
          />
          <ChartBar
            data={[
              {
                name: "Medium",
                x: " ",
                y: 4,
                label: "Medium: 4",
              },
            ]}
            labelComponent={<ChartTooltip constrainToVisibleArea />}
          />
          <ChartBar
            data={[
              {
                name: "Low",
                x: " ",
                y: 2,
                label: "Low: 2",
              },
            ]}
            labelComponent={<ChartTooltip constrainToVisibleArea />}
          />
          <ChartBar
            data={[
              {
                name: "None",
                x: " ",
                y: 1,
                label: "None: 1",
              },
            ]}
            labelComponent={<ChartTooltip constrainToVisibleArea />}
          />
        </ChartStack>
      </Chart>
    </div>
  );

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">Search</Text>
          <Text component="p">Search SBOMs and Vulnerabilities</Text>
        </TextContent>
        <Toolbar {...toolbarProps}>
          <ToolbarContent>
            <FilterToolbar showFiltersSideBySide {...filterToolbarProps} />
            <ToolbarItem {...paginationToolbarItemProps}>
              <SimplePagination
                idPrefix="search-table"
                isTop
                paginationProps={paginationProps}
              />
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>
      </PageSection>
      <PageSection>
        <Gallery hasGutter>
          {currentPageItems.map((item, index) => (
            <Card key={index} isCompact>
              <CardHeader
                selectableActions={{
                  isChecked: false,
                  selectableActionId: `selectable-actions-item-${index}`,
                  name: `check-${index}`,
                  onChange: () => {},
                }}
              >
                {item.type === "sbom" && sbomHeader(item)}
                {item.type === "vulnerability" && vulnerabilityHeader(item)}
              </CardHeader>
              <CardTitle>
                {item.type === "sbom" && sbomTitle(item)}
                {item.type === "vulnerability" && vulnerabilityTitle(item)}
              </CardTitle>

              <CardBody>
                {item.type === "sbom" && sbomBody(item)}
                {item.type === "vulnerability" && vulnerabilityBody(item)}
              </CardBody>

              <CardFooter>
                {item.type === "sbom" && sbomFooter(item)}
                {item.type === "vulnerability" && vulnerabilityFooter(item)}
              </CardFooter>
            </Card>
          ))}
        </Gallery>
      </PageSection>
    </>
  );
};
