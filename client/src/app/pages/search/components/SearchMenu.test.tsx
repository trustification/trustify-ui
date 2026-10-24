import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import {
  type MockedFunction,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { MemoryRouter } from "react-router-dom";

import { FILTER_TEXT_CATEGORY_KEY } from "@app/Constants";
import { SbomSearchContext } from "@app/pages/sbom-list/sbom-context";
import { useFetchAdvisories } from "@app/queries/advisories";
import { useFetchPackages } from "@app/queries/packages";
import { useFetchSBOMs } from "@app/queries/sboms";
import { useFetchVulnerabilities } from "@app/queries/vulnerabilities";

import { SearchMenu } from "./SearchMenu";

vi.mock("@app/queries/advisories");
vi.mock("@app/queries/packages");
vi.mock("@app/queries/sboms");
vi.mock("@app/queries/vulnerabilities");

const mockedUseFetchAdvisories = useFetchAdvisories as MockedFunction<
  typeof useFetchAdvisories
>;
const mockedUseFetchPackages = useFetchPackages as MockedFunction<
  typeof useFetchPackages
>;
const mockedUseFetchSBOMs = useFetchSBOMs as MockedFunction<
  typeof useFetchSBOMs
>;
const mockedUseFetchVulnerabilities = useFetchVulnerabilities as MockedFunction<
  typeof useFetchVulnerabilities
>;

const emptyFetchResult = {
  isFetching: false,
  result: { data: [], total: 0, params: {} },
  fetchError: null,
  refetch: vi.fn(),
};

const getDisableSearchFlags = () => ({
  advisories: mockedUseFetchAdvisories.mock.calls.at(-1)?.[2],
  packages: mockedUseFetchPackages.mock.calls.at(-1)?.[1],
  sboms: mockedUseFetchSBOMs.mock.calls.at(-1)?.[3],
  vulnerabilities: mockedUseFetchVulnerabilities.mock.calls.at(-1)?.[1],
});

const allAutocompleteDisabled = (
  flags: ReturnType<typeof getDisableSearchFlags>,
) =>
  flags.advisories === true &&
  flags.packages === true &&
  flags.sboms === true &&
  flags.vulnerabilities === true;

const allAutocompleteEnabled = (
  flags: ReturnType<typeof getDisableSearchFlags>,
) =>
  flags.advisories === false &&
  flags.packages === false &&
  flags.sboms === false &&
  flags.vulnerabilities === false;

const renderSearchMenu = ({
  filterValues = {},
  onChangeSearch = vi.fn(),
}: {
  filterValues?: Record<string, string[]>;
  onChangeSearch?: (searchValue: string | undefined) => void;
} = {}) => {
  const setFilterValues = vi.fn();

  const contextValue = {
    tableControls: {
      filterState: {
        filterValues,
        setFilterValues,
      },
    },
  } as unknown as React.ContextType<typeof SbomSearchContext>;

  return {
    onChangeSearch,
    setFilterValues,
    ...render(
      <MemoryRouter>
        <SbomSearchContext.Provider value={contextValue}>
          <SearchMenu onChangeSearch={onChangeSearch} />
        </SbomSearchContext.Provider>
      </MemoryRouter>,
    ),
  };
};

describe("SearchMenu autocomplete fetch gating (TC-2443)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    mockedUseFetchAdvisories.mockReturnValue(emptyFetchResult);
    mockedUseFetchPackages.mockReturnValue(emptyFetchResult);
    mockedUseFetchSBOMs.mockReturnValue(emptyFetchResult);
    mockedUseFetchVulnerabilities.mockReturnValue(emptyFetchResult);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("disables autocomplete fetches on initial mount with empty input", () => {
    renderSearchMenu();

    expect(allAutocompleteDisabled(getDisableSearchFlags())).toBe(true);
  });

  it("enables autocomplete fetches when typing a non-empty query", async () => {
    renderSearchMenu();

    fireEvent.change(screen.getByRole("textbox", { name: "Search input" }), {
      target: { value: "some" },
    });

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(allAutocompleteEnabled(getDisableSearchFlags())).toBe(true);
  });

  it("disables autocomplete fetches for whitespace-only input while dirty", () => {
    renderSearchMenu();

    fireEvent.change(screen.getByRole("textbox", { name: "Search input" }), {
      target: { value: "   " },
    });

    expect(allAutocompleteDisabled(getDisableSearchFlags())).toBe(true);
  });

  it("disables autocomplete fetches after submit", () => {
    const onChangeSearch = vi.fn();
    renderSearchMenu({ onChangeSearch });

    const input = screen.getByRole("textbox", { name: "Search input" });
    fireEvent.change(input, { target: { value: "some" } });
    fireEvent.click(screen.getByRole("button", { name: "Search" }));

    expect(onChangeSearch).toHaveBeenCalledWith("some");
    expect(allAutocompleteDisabled(getDisableSearchFlags())).toBe(true);
  });

  it("disables autocomplete fetches after clear", () => {
    const onChangeSearch = vi.fn();
    renderSearchMenu({
      filterValues: { [FILTER_TEXT_CATEGORY_KEY]: ["previous"] },
      onChangeSearch,
    });

    fireEvent.change(screen.getByRole("textbox", { name: "Search input" }), {
      target: { value: "previous" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Reset" }));

    expect(onChangeSearch).toHaveBeenCalledWith("");
    expect(allAutocompleteDisabled(getDisableSearchFlags())).toBe(true);
  });

  it("does not flash stale filter text into the input while clearing filters", () => {
    const onChangeSearch = vi.fn();
    const { rerender } = renderSearchMenu({
      filterValues: { [FILTER_TEXT_CATEGORY_KEY]: ["something"] },
      onChangeSearch,
    });

    const input = screen.getByRole("textbox", { name: "Search input" });
    fireEvent.change(input, { target: { value: "something" } });
    fireEvent.click(screen.getByRole("button", { name: "Search" }));

    fireEvent.click(screen.getByRole("button", { name: "Reset" }));

    const contextWithStaleFilter = {
      tableControls: {
        filterState: {
          filterValues: { [FILTER_TEXT_CATEGORY_KEY]: ["something"] },
          setFilterValues: vi.fn(),
        },
      },
    } as unknown as React.ContextType<typeof SbomSearchContext>;

    rerender(
      <MemoryRouter>
        <SbomSearchContext.Provider value={contextWithStaleFilter}>
          <SearchMenu onChangeSearch={onChangeSearch} />
        </SbomSearchContext.Provider>
      </MemoryRouter>,
    );

    expect(input).toHaveValue("");

    fireEvent.click(screen.getByRole("button", { name: "Search" }));

    expect(input).toHaveValue("");
  });
});
