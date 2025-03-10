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

export const ProductsPage: React.FC = () => {
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
          })
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

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">Products</Text>
          <Text component="p">Group your SBOMs under products</Text>
        </TextContent>
        <Toolbar {...toolbarProps}>
          <ToolbarContent>
            <FilterToolbar showFiltersSideBySide {...filterToolbarProps} />
            <ToolbarItem></ToolbarItem>
            <ToolbarItem {...paginationToolbarItemProps}>
              <SimplePagination
                idPrefix="products-table"
                isTop
                paginationProps={paginationProps}
              />
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>
      </PageSection>
      <PageSection>table</PageSection>
    </>
  );
};
