import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
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

export const PrimaryState: Story = {
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
