import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
<<<<<<< HEAD
import { AdvisoryTable } from "./advisory-table";
import { AdvisorySearchContext } from "./advisory-context";
import listResponse from "@mocks/data/advisory/list.json";
import { BrowserRouter } from "react-router-dom";

const meta = {
  title: "Components/AdvisoryList/AdvisoryTable",
  component: AdvisoryTable,
  tags: ["autodocs"],
  decorators: [
    (Story, { parameters }) => {
      const { contextDefaultValue } = parameters;
      return (
        <BrowserRouter>
          <AdvisorySearchContext.Provider value={contextDefaultValue}>
            <Story />
          </AdvisorySearchContext.Provider>
        </BrowserRouter>
      );
    },
  ],
} satisfies Meta<typeof AdvisoryTable>;

export default meta;
type Story = StoryObj<typeof meta>;

const tableControlsCustom = {
  tableName: "advisory",
  persistenceKeyPrefix: "ad",
  persistTo: "urlParams",
  columnNames: {
    identifier: "ID",
    title: "Title",
    severity: "Aggregated Severity",
    modified: "Revision",
    vulnerabilities: "Vulnerabilities",
  },
  isPaginationEnabled: true,
  isSortEnabled: true,
  sortableColumns: ["identifier", "severity", "modified"],
=======
import { BrowserRouter } from "react-router-dom";
import { AdvisoryTable } from "./advisory-table";
import { AdvisorySearchContext } from "./advisory-context";
import listResponse from "@mocks/data/advisory/list.json";

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
>>>>>>> c1bcfb8 (feat(story): advisory table)
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
<<<<<<< HEAD
      title: "Severity",
      placeholderText: "Severity",
=======
      title: "CVSS",
      placeholderText: "CVSS",
>>>>>>> c1bcfb8 (feat(story): advisory table)
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
<<<<<<< HEAD
    {
      categoryKey: "modified",
      title: "Revision",
      type: "dateRange",
    },
  ],
  isExpansionEnabled: false,
=======
  ],
  isExpansionEnabled: true,
  expandableVariant: "compound",
>>>>>>> c1bcfb8 (feat(story): advisory table)
  filterState: {
    filterValues: {},
  },
  sortState: {
    activeSort: {
<<<<<<< HEAD
      columnKey: "identifier",
=======
      columnKey: "modified",
>>>>>>> c1bcfb8 (feat(story): advisory table)
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
<<<<<<< HEAD
        label: "Title",
=======
        label: "Description",
>>>>>>> c1bcfb8 (feat(story): advisory table)
        isVisible: true,
      },
      {
        id: "severity",
<<<<<<< HEAD
        label: "Aggregated Severity",
        isVisible: true,
      },
      {
        id: "modified",
        label: "Revision",
        isVisible: true,
      },
      {
        id: "vulnerabilities",
        label: "Vulnerabilities",
=======
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
>>>>>>> c1bcfb8 (feat(story): advisory table)
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
<<<<<<< HEAD
      className: "",
=======
>>>>>>> c1bcfb8 (feat(story): advisory table)
      collapseListedFiltersBreakpoint: "xl",
      clearFiltersButtonText: "Clear all filters",
    },
    tableProps: {
      isExpandable: false,
    },
<<<<<<< HEAD
    filterToolbarProps: {},
    paginationProps: {
      itemCount: 58,
      perPage: 10,
      page: 1,
    },
    paginationToolbarItemProps: {
      variant: "pagination",
      align: {
        default: "alignRight",
      },
    },
    toolbarBulkSelectorProps: {
      areAllSelected: false,
=======
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
>>>>>>> c1bcfb8 (feat(story): advisory table)
    },
    getThProps: () => {},
    getTrProps: () => {},
    getTdProps: () => {},
  },
};

<<<<<<< HEAD
=======
const meta = {
  title: "Components/AdvisoryList/AdvisoryTable",
  component: AdvisoryTable,
  tags: ["autodocs"],
  decorators: [
    (Story, { parameters }) => {
      const { contextDefaultValue } = parameters;
      return (
        <BrowserRouter>
          <AdvisorySearchContext.Provider value={contextDefaultValue}>
            <Story />
          </AdvisorySearchContext.Provider>
        </BrowserRouter>
      );
    },
  ],
} satisfies Meta<typeof AdvisoryTable>;

export default meta;
type Story = StoryObj<typeof meta>;

>>>>>>> c1bcfb8 (feat(story): advisory table)
export const PrimaryState: Story = {
  parameters: {
    contextDefaultValue: {
      isFetching: false,
<<<<<<< HEAD
      fetchError: null,
      tableControls: { ...tableControlsCustom },
      totalItemCount: 58,
=======
      fetchError: "",
      tableControls: { ...tableControlsCustom },
      totalItemCount: 3,
      currentPageItems: 10,
      numRenderedColumns: 3,
>>>>>>> c1bcfb8 (feat(story): advisory table)
    },
  },
};

// export const EmptyState: Story = {
//   args: {
//     isFetching: false,
//     fetchError: "",
//     tableControls: customTableControls,
//     totalItemCount: 3,
//     currentPageItems: 10,
//     numRenderedColumns: 3,
//   },
//   parameters: {
//     contextDefaultValue: dummyContextData,
//   },
// };
