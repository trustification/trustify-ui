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
  DescriptionListTerm,
  DescriptionListTermHelpText,
  DescriptionListTermHelpTextButton,
  Divider,
  Flex,
  FlexItem,
  Gallery,
  Grid,
  GridItem,
  Icon,
  Label,
  List,
  ListItem,
  PageSection,
  PageSectionVariants,
  Popover,
  Split,
  SplitItem,
  Stack,
  StackItem,
  Text,
  TextContent,
  ToggleGroup,
  ToggleGroupItem,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Tooltip,
} from "@patternfly/react-core";

import {
  Chart,
  ChartAxis,
  ChartBar,
  ChartStack,
  ChartThemeColor,
  ChartTooltip,
} from "@patternfly/react-charts";
import { right } from "@patternfly/react-core/dist/esm/helpers/Popper/thirdparty/popper-core";
import {
  BoxIcon,
  CircleNotchIcon,
  GithubIcon,
  ListIcon,
  ReceiptIcon,
  RedhatIcon,
  SeverityCriticalIcon,
  SeverityImportantIcon,
  SeverityMinorIcon,
  SeverityModerateIcon,
  SeverityNoneIcon,
  ShieldVirusIcon,
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

//

interface Data {
  type: "sbom" | "vulnerability" | "pkg";
  name: string;
}

const sboms: Data[] = [...Array(4).keys()].map((item) => ({
  type: "sbom",
  name: `sbom-${item}`,
}));
const vulnerabilities: Data[] = [...Array(4).keys()].map((item) => ({
  type: "vulnerability",
  name: `CVE-${item}`,
}));
const pkgs: Data[] = [...Array(4).keys()].map((item) => ({
  type: "pkg",
  name: `package-${item}`,
}));

export const SearchPage: React.FC = () => {
  const tableControls = useLocalTableControls({
    tableName: "search-table",
    idProperty: "name",
    items: [...sboms, ...vulnerabilities, ...pkgs],
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
      {
        categoryKey: "vulnerability",
        title: "Vulnerability",
        type: FilterType.multiselect,
        logicOperator: "OR",
        selectOptions: [...Array(vulnerabilities.length).keys()].map(
          (item) => ({
            value: `CVE-${item}`,
            label: `CVE-${item}`,
          }),
        ),
        placeholderText: "Vulnerability",
        matcher: (filter, item) => {
          return item.type !== "vulnerability" ? true : filter === item.name;
        },
      },
      {
        categoryKey: "sbom",
        title: "SBOM",
        type: FilterType.multiselect,
        logicOperator: "OR",
        selectOptions: [...Array(sboms.length).keys()].map((item) => ({
          value: `sbom-${item}`,
          label: `sbom-${item}`,
        })),
        placeholderText: "SBOM",
        matcher: (filter, item) => {
          return item.type !== "sbom" ? true : filter === item.name;
        },
      },
      {
        categoryKey: "pkg",
        title: "Package",
        type: FilterType.multiselect,
        logicOperator: "OR",
        selectOptions: [...Array(pkgs.length).keys()].map((item) => ({
          value: `package-${item}`,
          label: `package-${item}`,
        })),
        placeholderText: "Package",
        matcher: (filter, item) => {
          return item.type !== "pkg" ? true : filter === item.name;
        },
      },
    ],
    initialItemsPerPage: 20,
  });

  const {
    currentPageItems,
    propHelpers: {
      toolbarProps,
      filterToolbarProps,
      paginationToolbarItemProps,
      paginationProps,
    },
  } = tableControls;

  //
  const sbomCard = (item: Data) => {
    return (
      <>
        <CardHeader
          selectableActions={{
            isChecked: false,
            selectableActionId: `selectable-actions-item-${item.name}`,
            name: `check-${item.name}`,
            onChange: () => {},
          }}
        >
          <Label color="green" variant="outline" isCompact>
            SBOM
          </Label>
        </CardHeader>
        <CardTitle>
          <Split>
            <SplitItem isFilled>{item.name}</SplitItem>
            <SplitItem>
              <Label isCompact>v8.1</Label>
            </SplitItem>
          </Split>
        </CardTitle>

        <CardBody>
          <Stack hasGutter>
            <StackItem>My SBOM Description</StackItem>
            <StackItem>
              <DescriptionList isCompact>
                <DescriptionListGroup>
                  <DescriptionListTermHelpText>
                    <Popover
                      headerContent={<div>Product</div>}
                      bodyContent={
                        <div>The product where this SBOM belongs to</div>
                      }
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
        </CardBody>

        <CardFooter>
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
        </CardFooter>
      </>
    );
  };

  const vulnerabilityCard = (item: Data) => {
    return (
      <>
        <CardHeader
          selectableActions={{
            isChecked: false,
            selectableActionId: `selectable-actions-item-${item.name}`,
            name: `check-${item.name}`,
            onChange: () => {},
          }}
        >
          <Label color="purple" variant="outline" isCompact>
            Vulnerability
          </Label>
        </CardHeader>
        <CardTitle>
          <Split>
            <SplitItem isFilled>{item.name}</SplitItem>
            <SplitItem>
              <SeverityShieldAndText value="medium" score={5} />
            </SplitItem>
          </Split>
        </CardTitle>

        <CardBody>
          Apache James MIME4J: Temporary File Information Disclosure in MIME4J
          TempFileStorageProvider
        </CardBody>

        <CardFooter>
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
        </CardFooter>
      </>
    );
  };

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

  const packageCard = (item: Data) => {
    return (
      <>
        <CardHeader
          selectableActions={{
            isChecked: false,
            selectableActionId: `selectable-actions-item-${item.name}`,
            name: `check-${item.name}`,
            onChange: () => {},
          }}
        >
          <Label color="gold" variant="outline" isCompact>
            Package
          </Label>
        </CardHeader>
        <CardTitle>
          <Split>
            <SplitItem isFilled>{item.name}</SplitItem>
            <SplitItem>
              <Label color="grey" variant="outline" isCompact>
                Maven
              </Label>
            </SplitItem>
          </Split>
        </CardTitle>

        <CardBody>
          <DescriptionList isCompact>
            <DescriptionListGroup>
              <DescriptionListTermHelpText>
                Namespace
              </DescriptionListTermHelpText>
              <DescriptionListDescription>
                <Text component="p"> org.apache.logging.log4j</Text>
              </DescriptionListDescription>
            </DescriptionListGroup>
          </DescriptionList>
        </CardBody>

        <CardFooter>
          <DescriptionList isCompact>
            <DescriptionListGroup>
              <DescriptionListTerm>Versions</DescriptionListTerm>
              <DescriptionListDescription>
                <List>
                  {[...Array(3).keys()].reverse().map((key) => (
                    <ListItem key={key}>
                      <Grid hasGutter>
                        <GridItem md={4}>2.11.{key}</GridItem>
                        <GridItem md={4}>
                          <Popover
                            aria-label="Basic popover"
                            triggerAction="hover"
                            headerContent={<div>SBOMs</div>}
                            bodyContent={
                              <div>57 SBOMs contain this package</div>
                            }
                            footerContent={
                              <>
                                <a>See SBOMs</a>
                              </>
                            }
                          >
                            <TextContent>
                              <Text component="small">
                                <Icon isInline size="sm">
                                  <ReceiptIcon />
                                </Icon>{" "}
                                <a>15</a>
                              </Text>
                            </TextContent>
                          </Popover>
                        </GridItem>
                        <GridItem md={4}>
                          <Popover
                            aria-label="Basic popover"
                            triggerAction="hover"
                            headerContent={<div>SBOMs</div>}
                            bodyContent={
                              <Flex
                                spaceItems={{ default: "spaceItemsSm" }}
                                alignItems={{ default: "alignItemsCenter" }}
                                flexWrap={{ default: "nowrap" }}
                                style={{ whiteSpace: "nowrap" }}
                              >
                                <FlexItem
                                  style={{ minWidth: 15, textAlign: right }}
                                >
                                  57
                                </FlexItem>
                                <Divider
                                  orientation={{ default: "vertical" }}
                                />
                                <FlexItem>
                                  <Flex>
                                    {Object.entries(severityList)
                                      .reverse()
                                      .map(([severity, _count], index) => (
                                        <FlexItem
                                          key={index}
                                          spacer={{ default: "spacerXs" }}
                                        >
                                          <Flex
                                            spaceItems={{
                                              default: "spaceItemsXs",
                                            }}
                                            alignItems={{
                                              default: "alignItemsCenter",
                                            }}
                                            flexWrap={{ default: "nowrap" }}
                                            style={{ whiteSpace: "nowrap" }}
                                          >
                                            <FlexItem>
                                              <Flex
                                                spaceItems={{
                                                  default: "spaceItemsXs",
                                                }}
                                                alignItems={{
                                                  default: "alignItemsCenter",
                                                }}
                                                flexWrap={{ default: "nowrap" }}
                                                style={{ whiteSpace: "nowrap" }}
                                              >
                                                <FlexItem>
                                                  <Tooltip content={severity}>
                                                    <>
                                                      {index === 0 && (
                                                        <SeverityCriticalIcon color="#b1380b" />
                                                      )}
                                                      {index === 1 && (
                                                        <SeverityImportantIcon color="#ca6c0f" />
                                                      )}
                                                      {index === 2 && (
                                                        <SeverityModerateIcon color="#dca614" />
                                                      )}
                                                      {index === 3 && (
                                                        <SeverityMinorIcon color="#707070" />
                                                      )}
                                                      {index === 4 && (
                                                        <SeverityNoneIcon color="#4394e5" />
                                                      )}
                                                    </>
                                                  </Tooltip>
                                                </FlexItem>
                                              </Flex>
                                            </FlexItem>
                                            <FlexItem>{1}</FlexItem>
                                          </Flex>
                                        </FlexItem>
                                      ))}
                                  </Flex>
                                </FlexItem>
                              </Flex>
                            }
                            footerContent={
                              <>
                                <a>See all Vulnerabilities</a>
                              </>
                            }
                          >
                            <TextContent>
                              <Text component="small">
                                <Icon isInline size="sm">
                                  <ShieldVirusIcon />
                                </Icon>{" "}
                                <a>57</a>
                              </Text>
                            </TextContent>
                          </Popover>
                        </GridItem>
                      </Grid>
                    </ListItem>
                  ))}
                </List>
                <a>All 49 versions</a>
              </DescriptionListDescription>
            </DescriptionListGroup>
          </DescriptionList>
        </CardFooter>
      </>
    );
  };

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
            <ToolbarItem>
              <ToggleGroup aria-label="Default with single selectable">
                <ToggleGroupItem
                  icon={<BoxIcon />}
                  buttonId="toggle-group-single-1"
                  isSelected={true}
                  onChange={() => {}}
                />
                <ToggleGroupItem
                  icon={<ListIcon />}
                  buttonId="toggle-group-single-2"
                  isSelected={false}
                  onChange={() => {}}
                />
              </ToggleGroup>
            </ToolbarItem>
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
              {item.type === "sbom" && sbomCard(item)}
              {item.type === "vulnerability" && vulnerabilityCard(item)}
              {item.type === "pkg" && packageCard(item)}
            </Card>
          ))}
        </Gallery>
      </PageSection>
    </>
  );
};
