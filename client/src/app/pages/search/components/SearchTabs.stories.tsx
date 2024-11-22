import React from "react";
import { AdvisorySearchContext } from "@app/pages/advisory-list/advisory-context";
import type { Meta, StoryObj } from "@storybook/react";
import { SearchTabs, SearchTabsProps } from "./SearchTabs";
import { IAdvisorySearchContext } from "@app/pages/advisory-list/advisory-context";

const mockContextValue: IAdvisorySearchContext = {} as IAdvisorySearchContext;

const meta: Meta<typeof SearchTabs> = {
  title: "Components/Search/SearchTabs",
  component: SearchTabs,
  decorators: [
    (Story) => (
      <AdvisorySearchContext.Provider value={mockContextValue}>
        <Story />
      </AdvisorySearchContext.Provider>
    ),
  ],
};

export default meta;

type Story = StoryObj<SearchTabsProps>;

const customFilterPanelProps = {
  advisoryFilterPanelProps: mockContextValue.tableControls.filterState,
  //   advisoryFilterPanelProps: {
  //     filterCategories: [
  //       {
  //         categoryKey: "",
  //         title: "Filter text",
  //         placeholderText: "Search",
  //         type: "search",
  //       },
  //       {
  //         categoryKey: "average_severity",
  //         title: "Severity",
  //         placeholderText: "Severity",
  //         type: "multiselect",
  //         selectOptions: [
  //           {
  //             value: "none",
  //             label: "None",
  //           },
  //           {
  //             value: "low",
  //             label: "Low",
  //           },
  //           {
  //             value: "medium",
  //             label: "Medium",
  //           },
  //           {
  //             value: "high",
  //             label: "High",
  //           },
  //           {
  //             value: "critical",
  //             label: "Critical",
  //           },
  //         ],
  //       },
  //       {
  //         categoryKey: "modified",
  //         title: "Revision",
  //         type: "dateRange",
  //       },
  //     ],
  //     filterValues: {},
  //   },
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
  },
};

export const DefaultState: Story = {
  args: {
    filterPanelProps: customFilterPanelProps,
  },
};

export const ErrorState: Story = {};
