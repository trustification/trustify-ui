import React from "react";
import { AdvisorySearchContext } from "@app/pages/advisory-list/advisory-context";
import type { Meta, StoryObj } from "@storybook/react";
import { SearchTabs, SearchTabsProps } from "./SearchTabs";
import listResponse from "@mocks/data/advisory/list.json";
import * as stories from "../../advisory-list/advisory-table.stories";
import { composeStories } from "@storybook/react";
const { PrimaryState } = composeStories(stories);

const tableControlsCustom = {
  tableName: "advisory",
  persistenceKeyPrefix: "vn",
  columnNames: {
    identifier: "ID",
    title: "Description",
    severity: "CVSS",
    published: "Date published",
    sboms: "Related documents",
  },
  isPaginationEnabled: true,
  isSortEnabled: true,
  sortableColumns: ["published", "sboms"],
  isFilterEnabled: true,
  filterCategories: [
    {
      categoryKey: "",
      title: "Filter text",
      placeholderText: "Search",
      type: "search",
    },
    {
      categoryKey: "average_severity",
      title: "CVSS",
      placeholderText: "CVSS",
      type: "multiselect",
      selectOptions: [
        {
          value: "none",
          label: "None",
        },
        {
          value: "low",
          label: "Low",
        },
        {
          value: "medium",
          label: "Medium",
        },
        {
          value: "high",
          label: "High",
        },
        {
          value: "critical",
          label: "Critical",
        },
      ],
    },
  ],
  isExpansionEnabled: true,
  expandableVariant: "compound",
  filterState: {
    filterValues: {},
  },
  sortState: {
    activeSort: {
      columnKey: "modified",
      direction: "asc",
    },
  },
  paginationState: {
    pageNumber: 1,
    itemsPerPage: 10,
  },
  expansionState: {
    expandedCells: {},
  },
  activeItemState: {
    activeItemId: null,
  },
  columnState: {
    columns: [
      {
        id: "identifier",
        label: "ID",
        isVisible: true,
      },
      {
        id: "title",
        label: "Description",
        isVisible: true,
      },
      {
        id: "severity",
        label: "CVSS",
        isVisible: true,
      },
      {
        id: "published",
        label: "Date published",
        isVisible: true,
      },
      {
        id: "sboms",
        label: "Related documents",
        isVisible: true,
      },
    ],
  },
  idProperty: "identifier",
  currentPageItems: listResponse.items,
  totalItemCount: listResponse.total,
  isLoading: false,
  selectionState: {
    selectedItems: [],
    areAllSelected: false,
  },
  numColumnsBeforeData: 0,
  numColumnsAfterData: 0,
  numRenderedColumns: 5,
  expansionDerivedState: {
    isCellExpanded: jest.fn(),
  },
  activeItemDerivedState: {
    activeItem: null,
  },
  propHelpers: {
    toolbarProps: {
      collapseListedFiltersBreakpoint: "xl",
      clearFiltersButtonText: "Clear all filters",
    },
    tableProps: {
      isExpandable: false,
    },
    filterToolbarProps: {
      filterCategories: [
        {
          categoryKey: "",
          title: "Filter text",
          placeholderText: "Search",
          type: "search",
        },
        {
          categoryKey: "average_severity",
          title: "CVSS",
          placeholderText: "CVSS",
          type: "multiselect",
          selectOptions: [
            {
              value: "none",
              label: "None",
            },
            {
              value: "low",
              label: "Low",
            },
            {
              value: "medium",
              label: "Medium",
            },
            {
              value: "high",
              label: "High",
            },
            {
              value: "critical",
              label: "Critical",
            },
          ],
        },
      ],
      filterValues: {},
    },
    filterPanelProps: {
      filterCategories: [
        {
          categoryKey: "",
          title: "Filter text",
          placeholderText: "Search",
          type: "search",
        },
        {
          categoryKey: "average_severity",
          title: "CVSS",
          placeholderText: "CVSS",
          type: "multiselect",
          selectOptions: [
            {
              value: "none",
              label: "None",
            },
            {
              value: "low",
              label: "Low",
            },
            {
              value: "medium",
              label: "Medium",
            },
            {
              value: "high",
              label: "High",
            },
            {
              value: "critical",
              label: "Critical",
            },
          ],
        },
      ],
      filterValues: {},
    },
    getThProps: () => {},
    getTrProps: () => {},
    getTdProps: () => {},
  },
};

const meta: Meta<typeof SearchTabs> = {
  title: "Components/Search/SearchTabs",
  component: SearchTabs,
  decorators: [
    (Story, { parameters }) => {
      const { contextDefaultValue } = parameters;
      return (
        <AdvisorySearchContext.Provider value={contextDefaultValue}>
          <Story />
        </AdvisorySearchContext.Provider>
      );
    },
  ],
};

export default meta;

type Story = StoryObj<SearchTabsProps>;

const customFilterPanelProps = {
  advisoryFilterPanelProps: {
    filterCategories: [
      {
        categoryKey: "",
        title: "Filter text",
        placeholderText: "Search",
        type: "search",
      },
      {
        categoryKey: "average_severity",
        title: "Severity",
        placeholderText: "Severity",
        type: "multiselect",
        selectOptions: [
          {
            value: "none",
            label: "None",
          },
          {
            value: "low",
            label: "Low",
          },
          {
            value: "medium",
            label: "Medium",
          },
          {
            value: "high",
            label: "High",
          },
          {
            value: "critical",
            label: "Critical",
          },
        ],
      },
      {
        categoryKey: "modified",
        title: "Revision",
        type: "dateRange",
      },
    ],
    filterValues: {},
    setFilterValues: jest.fn(),
  },
  packageFilterPanelProps: {
    filterCategories: [
      {
        categoryKey: "",
        title: "Filter text",
        placeholderText: "Search",
        type: "search",
      },
      {
        categoryKey: "type",
        title: "Type",
        placeholderText: "Type",
        type: "multiselect",
        selectOptions: [
          {
            value: "maven",
            label: "Maven",
          },
          {
            value: "rpm",
            label: "RPM",
          },
          {
            value: "npm",
            label: "NPM",
          },
          {
            value: "oci",
            label: "OCI",
          },
        ],
      },
      {
        categoryKey: "arch",
        title: "Architecture",
        placeholderText: "Architecture",
        type: "multiselect",
        selectOptions: [
          {
            value: "x86_64",
            label: "AMD 64bit",
          },
          {
            value: "aarch64",
            label: "ARM 64bit",
          },
          {
            value: "ppc64le",
            label: "PowerPC",
          },
          {
            value: "s390x",
            label: "S390",
          },
          {
            value: "noarch",
            label: "No Arch",
          },
        ],
      },
    ],
    filterValues: {},
    setFilterValues: jest.fn(),
  },
  sbomFilterPanelProps: {
    filterCategories: [
      {
        categoryKey: "",
        title: "Filter text",
        placeholderText: "Search",
        type: "search",
      },
      {
        categoryKey: "published",
        title: "Created on",
        type: "dateRange",
      },
    ],
    filterValues: {},
    setFilterValues: jest.fn(),
  },
  vulnerabilityFilterPanelProps: {
    filterCategories: [
      {
        categoryKey: "",
        title: "Filter text",
        placeholderText: "Search",
        type: "search",
      },
      {
        categoryKey: "average_severity",
        title: "CVSS",
        placeholderText: "CVSS",
        type: "multiselect",
        selectOptions: [
          {
            value: "none",
            label: "None",
          },
          {
            value: "low",
            label: "Low",
          },
          {
            value: "medium",
            label: "Medium",
          },
          {
            value: "high",
            label: "High",
          },
          {
            value: "critical",
            label: "Critical",
          },
        ],
      },
      {
        categoryKey: "published",
        title: "Created on",
        type: "dateRange",
      },
    ],
    filterValues: {},
    setFilterValues: jest.fn(),
  },
};

export const DefaultState: Story = {
  args: {
    advisoryTable: <PrimaryState />,
    filterPanelProps: customFilterPanelProps,
    packageTable: <>A package table here</>,
    sbomTable: <>An SBOM table here</>,
    vulnerabilityTable: <>A vulnerability table here</>,
  },
  parameters: {
    contextDefaultValue: {
      isFetching: false,
      fetchError: "",
      tableControls: { ...tableControlsCustom },
      totalItemCount: 3,
      currentPageItems: 10,
      numRenderedColumns: 3,
    },
  },
};
