import React from "react";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import type { CryptoAlgorithm, CryptoPolicySummary } from "./crypto-context";

const mockSummary: CryptoPolicySummary = {
  total: 22,
  compliant: 9,
  warning: 5,
  non_compliant: 8,
};

const mockAlgorithms: CryptoAlgorithm[] = [
  {
    node_id: "alg-1",
    name: "AES-256-GCM",
    asset_type: "algorithm",
    oid: null,
    properties: {
      algorithmProperties: { primitive: "pke", cryptoFunctions: ["keygen"] },
    },
    policy_status: "compliant",
    packages_count: 0,
    sboms_count: 0,
  },
  {
    node_id: "alg-2",
    name: "RSA-2048",
    asset_type: "algorithm",
    oid: null,
    properties: {
      algorithmProperties: {
        primitive: "signature",
        parameterSetIdentifier: "2048",
      },
    },
    policy_status: "non_compliant",
    packages_count: 0,
    sboms_count: 0,
  },
];

const mockKeys: CryptoAlgorithm[] = [
  {
    node_id: "key-1",
    name: "private-key",
    asset_type: "related-crypto-material",
    oid: null,
    properties: {
      relatedCryptoMaterialProperties: { type: "private-key" },
    },
    policy_status: "compliant",
    packages_count: 0,
    sboms_count: 0,
  },
];

vi.mock("@app/queries/crypto", () => ({
  useFetchCryptoPolicySummary: () => ({
    result: mockSummary,
    isFetching: false,
    fetchError: null,
    refetch: vi.fn(),
  }),
  useFetchCryptoAlgorithms: (
    _params: unknown,
    _disable: boolean,
    assetType?: string,
  ) => ({
    result: {
      data: assetType === "related-crypto-material" ? mockKeys : mockAlgorithms,
      total:
        assetType === "related-crypto-material"
          ? mockKeys.length
          : mockAlgorithms.length,
      params: {},
    },
    isFetching: false,
    fetchError: null,
    refetch: vi.fn(),
  }),
}));

vi.mock("@app/components/DocumentMetadata", () => ({
  DocumentMetadata: () => null,
}));

vi.mock("@app/components/LoadingWrapper", () => ({
  LoadingWrapper: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

import { CryptoList } from "./crypto-list";

/** Verifies that the page renders the title, KPI cards, tabs, and table content. */
describe("CryptoList", () => {
  const renderComponent = () =>
    render(
      <MemoryRouter>
        <CryptoList />
      </MemoryRouter>,
    );

  /** Verifies that the page title is rendered. */
  it("renders the page title", () => {
    renderComponent();
    expect(screen.getByText("Cryptography")).toBeInTheDocument();
  });

  /** Verifies that the compliant algorithms KPI card shows the correct percentage and count. */
  it("displays the compliant algorithms KPI card with correct values", () => {
    renderComponent();

    const card = screen.getByTestId("kpi-compliant");
    expect(card).toHaveTextContent("41%");
    expect(card).toHaveTextContent("9 of 22 algorithms");
    expect(card).toHaveTextContent("Compliant algorithms");
  });

  /** Verifies that the warning algorithms KPI card shows the correct percentage and count. */
  it("displays the warning algorithms KPI card with correct values", () => {
    renderComponent();

    const card = screen.getByTestId("kpi-warning");
    expect(card).toHaveTextContent("23%");
    expect(card).toHaveTextContent("5 of 22 algorithms");
    expect(card).toHaveTextContent("Algorithms with warnings");
  });

  /** Verifies that the non-compliant algorithms KPI card shows the correct percentage and count. */
  it("displays the non-compliant algorithms KPI card with correct values", () => {
    renderComponent();

    const card = screen.getByTestId("kpi-non-compliant");
    expect(card).toHaveTextContent("36%");
    expect(card).toHaveTextContent("8 of 22 algorithms");
    expect(card).toHaveTextContent("Non-compliant algorithms");
  });

  /** Verifies that both Algorithms and Keys tabs are rendered with item counts. */
  it("renders tabs with item counts", () => {
    renderComponent();

    expect(screen.getByText("Algorithms (2)")).toBeInTheDocument();
    expect(screen.getByText("Keys (1)")).toBeInTheDocument();
  });

  /** Verifies that the Algorithms tab renders all 8 table columns. */
  it("renders all 8 algorithm table columns", () => {
    renderComponent();

    expect(screen.getByText("Algorithm name")).toBeInTheDocument();
    expect(screen.getByText("Primitive")).toBeInTheDocument();
    expect(screen.getAllByText("Occurrences").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Policy")).toBeInTheDocument();
    expect(screen.getByText("Recommendation")).toBeInTheDocument();
    expect(screen.getAllByText("Usage").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Packages")).toBeInTheDocument();
    expect(screen.getAllByText("SBOMs").length).toBeGreaterThanOrEqual(1);
  });

  /** Verifies that algorithm data rows render with correct compliance badges. */
  it("renders algorithm data with compliance badges", () => {
    renderComponent();

    expect(screen.getByText("AES-256-GCM")).toBeInTheDocument();
    expect(screen.getByText("RSA-2048")).toBeInTheDocument();
    expect(screen.getByText("Compliant")).toBeInTheDocument();
    expect(screen.getByText("Non-compliant")).toBeInTheDocument();
  });

  /** Verifies that the Keys tab renders its 5 columns and key data. */
  it("renders Keys tab with correct columns and data", () => {
    renderComponent();

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Type")).toBeInTheDocument();
    expect(screen.getAllByText("private-key").length).toBeGreaterThanOrEqual(1);
  });

  /** Verifies that pagination controls are rendered on the Algorithms tab. */
  it("renders pagination controls", () => {
    renderComponent();

    const paginationElements = screen.getAllByLabelText(/pagination/i);
    expect(paginationElements.length).toBeGreaterThan(0);
  });
});
