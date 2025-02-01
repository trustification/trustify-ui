import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AdvisoryTable } from "./advisory-table";
import { AdvisorySearchContext } from "./advisory-context";
import listResponse from "@mocks/data/advisory/list.json";

const meta = {
  title: "Components/AdvisoryList/AdvisoryTable",
  component: AdvisoryTable,
  tags: ["autodocs"],
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
  isExpansionEnabled: false,
  filterState: {
    filterValues: {},
  },
  sortState: {
    activeSort: {
      columnKey: "identifier",
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
        label: "Title",
        isVisible: true,
      },
      {
        id: "severity",
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
      className: "",
      collapseListedFiltersBreakpoint: "xl",
      clearFiltersButtonText: "Clear all filters",
    },
    tableProps: {
      isExpandable: false,
    },
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
    },
    getThProps: () => {},
    getTrProps: () => {},
    getTdProps: () => {},
  },
};

export const PrimaryState: Story = {
  parameters: {
    contextDefaultValue: {
      isFetching: false,
      fetchError: null,
      tableControls: { ...tableControlsCustom },
      totalItemCount: tableControlsCustom.currentPageItems.length,
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
