import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Importer } from "@app/client";

const mocks = vi.hoisted(() => ({
  updateImporter: vi.fn(),
  importers: [] as unknown[],
}));

vi.mock("@app/queries/importers", () => ({
  useFetchImporters: () => ({
    importers: mocks.importers,
    isFetching: false,
    fetchError: null,
    refetch: vi.fn(),
  }),
  useUpdateImporterMutation: () => ({ mutate: mocks.updateImporter }),
  useFetchImporterReports: () => ({
    result: { data: [], total: 0 },
    isFetching: false,
    fetchError: null,
    refetch: vi.fn(),
  }),
}));

import { ImporterList } from "./importer-list";

const enabledSbomImporter: Importer = {
  name: "redhat-sbom",
  state: "waiting",
  lastChange: "2024-01-01T00:00:00Z",
  configuration: {
    sbom: {
      description: "Red Hat SBOMs",
      source: "https://example.com/sbom",
      period: "30m",
      disabled: false,
      v3Signatures: true,
    },
  },
} as Importer;

const disabledCsafImporter: Importer = {
  name: "redhat-csaf",
  state: "waiting",
  lastChange: "2024-01-01T00:00:00Z",
  configuration: {
    csaf: {
      description: "Red Hat CSAF",
      source: "https://example.com/csaf",
      period: "1h",
      disabled: true,
    },
  },
} as Importer;

const runningSbomImporter: Importer = {
  name: "running-sbom",
  state: "running",
  lastChange: "2024-01-01T00:00:00Z",
  configuration: {
    sbom: {
      description: "Currently running",
      source: "https://example.com/running",
      period: "10m",
      disabled: false,
    },
  },
} as Importer;

const renderList = (importers: Importer[]) => {
  mocks.importers = importers;
  return render(
    <MemoryRouter>
      <ImporterList />
    </MemoryRouter>,
  );
};

const rowFor = (name: string) =>
  // biome-ignore lint/style/noNonNullAssertion: the row is asserted to exist
  screen.getByText(name).closest("tr")!;

/** Opens the kebab actions menu of the row whose name cell matches `name`. */
const openRowActions = (name: string) => {
  const toggle = within(rowFor(name) as HTMLElement).getByRole("button", {
    name: /kebab toggle/i,
  });
  fireEvent.click(toggle);
};

describe("ImporterList", () => {
  beforeEach(() => {
    mocks.updateImporter.mockClear();
  });

  /**
   * Pins the row rendering path: the single key of `configuration` is used both
   * as the displayed "Type" and as the index to read the config values from
   * (importer-list.tsx line ~326-330).
   */
  it("renders the configuration key as the Type column and its values", () => {
    renderList([enabledSbomImporter, disabledCsafImporter]);

    const sbomRow = within(rowFor("redhat-sbom") as HTMLElement);
    expect(sbomRow.getByText("sbom")).toBeInTheDocument();
    expect(sbomRow.getByText("Red Hat SBOMs")).toBeInTheDocument();
    expect(sbomRow.getByText("https://example.com/sbom")).toBeInTheDocument();
    expect(sbomRow.getByText("30m")).toBeInTheDocument();

    const csafRow = within(rowFor("redhat-csaf") as HTMLElement);
    expect(csafRow.getByText("csaf")).toBeInTheDocument();
    expect(csafRow.getByText("Red Hat CSAF")).toBeInTheDocument();
    expect(csafRow.getByText("https://example.com/csaf")).toBeInTheDocument();
    expect(csafRow.getByText("1h")).toBeInTheDocument();
  });

  /**
   * Pins `getImporterStatus` (importer-list.tsx line ~75-86) through the State
   * column: `disabled: false` + state "waiting" => Scheduled, `disabled: true`
   * => Disabled, `disabled: false` + state "running" => Running.
   */
  it("derives the State column from the indexed configuration values", () => {
    renderList([
      enabledSbomImporter,
      disabledCsafImporter,
      runningSbomImporter,
    ]);

    expect(
      within(rowFor("redhat-sbom") as HTMLElement).getByText("Scheduled"),
    ).toBeInTheDocument();
    expect(
      within(rowFor("redhat-csaf") as HTMLElement).getByText("Disabled"),
    ).toBeInTheDocument();
    expect(
      within(rowFor("running-sbom") as HTMLElement).getByText("Running"),
    ).toBeInTheDocument();
  });

  /** Pins that a disabled importer offers "Enable" and an enabled one offers "Run"/"Disable". */
  it("offers Enable for disabled importers and Run/Disable for enabled ones", () => {
    renderList([enabledSbomImporter, disabledCsafImporter]);

    openRowActions("redhat-csaf");
    expect(
      screen.getByRole("menuitem", { name: "Enable" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("menuitem", { name: "Disable" })).toBeNull();

    openRowActions("redhat-sbom");
    expect(screen.getByRole("menuitem", { name: "Run" })).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: "Disable" }),
    ).toBeInTheDocument();
  });

  /**
   * Pins `execEnableDisableImporter` (importer-list.tsx line ~119-139): the
   * update payload must be keyed by the importer's own configuration key
   * ("sbom" here), preserve the other config values and flip `disabled`.
   */
  it("builds the disable payload under the importer's own configuration key", () => {
    renderList([enabledSbomImporter]);

    openRowActions("redhat-sbom");
    fireEvent.click(screen.getByRole("menuitem", { name: "Disable" }));
    fireEvent.click(screen.getByRole("button", { name: "confirm" }));

    expect(mocks.updateImporter).toHaveBeenCalledTimes(1);
    expect(mocks.updateImporter).toHaveBeenCalledWith({
      importerName: "redhat-sbom",
      configuration: {
        sbom: {
          description: "Red Hat SBOMs",
          source: "https://example.com/sbom",
          period: "30m",
          disabled: true,
          v3Signatures: true,
        },
      },
    });
  });

  /**
   * Same as above for the enable path, and with a non-"sbom" configuration key
   * to prove the key is read from the importer rather than hardcoded.
   */
  it("builds the enable payload under the importer's own configuration key", () => {
    renderList([disabledCsafImporter]);

    openRowActions("redhat-csaf");
    fireEvent.click(screen.getByRole("menuitem", { name: "Enable" }));
    fireEvent.click(screen.getByRole("button", { name: "confirm" }));

    expect(mocks.updateImporter).toHaveBeenCalledTimes(1);
    expect(mocks.updateImporter).toHaveBeenCalledWith({
      importerName: "redhat-csaf",
      configuration: {
        csaf: {
          description: "Red Hat CSAF",
          source: "https://example.com/csaf",
          period: "1h",
          disabled: false,
        },
      },
    });
  });

  /**
   * Pins that an importer whose single configuration key carries no `disabled`
   * flag is treated as disabled (`disabled === false` is required to enable).
   */
  it("treats an importer without an explicit disabled flag as disabled", () => {
    renderList([
      {
        name: "no-flag",
        state: "waiting",
        lastChange: "2024-01-01T00:00:00Z",
        configuration: {
          sbom: { source: "https://example.com/no-flag", period: "5m" },
        },
      } as Importer,
    ]);

    const row = within(rowFor("no-flag") as HTMLElement);
    expect(row.getByText("sbom")).toBeInTheDocument();
    expect(row.getByText("Disabled")).toBeInTheDocument();
  });
});
