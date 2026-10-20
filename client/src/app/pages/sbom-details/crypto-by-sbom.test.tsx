import React from "react";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import type { CryptoAlgorithm } from "@app/pages/crypto-list/crypto-context";

const mockAlgorithms: CryptoAlgorithm[] = [
  {
    node_id: "alg-1",
    name: "AES-256-GCM",
    asset_type: "algorithm",
    oid: null,
    properties: {
      algorithmProperties: { primitive: "block-cipher" },
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
      algorithmProperties: { primitive: "pke", parameterSetIdentifier: "2048" },
    },
    policy_status: "warning",
    packages_count: 0,
    sboms_count: 0,
  },
  {
    node_id: "alg-3",
    name: "SHA-256",
    asset_type: "algorithm",
    oid: null,
    properties: {
      algorithmProperties: { primitive: "hash" },
    },
    policy_status: "non_compliant",
    packages_count: 0,
    sboms_count: 0,
  },
];

const mockKeys: CryptoAlgorithm[] = [
  {
    node_id: "key-1",
    name: "private-key-rsa",
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

let returnEmpty = false;

vi.mock("@app/queries/crypto", () => ({
  useFetchCryptoBySbom: (
    _sbomId: string,
    _params: unknown,
    assetType?: string,
  ) => {
    if (returnEmpty) {
      return {
        result: { data: [], total: 0, params: {} },
        isFetching: false,
        fetchError: null,
        refetch: vi.fn(),
      };
    }
    const data =
      assetType === "related-crypto-material" ? mockKeys : mockAlgorithms;
    return {
      result: { data, total: data.length, params: {} },
      isFetching: false,
      fetchError: null,
      refetch: vi.fn(),
    };
  },
}));

vi.mock("@app/components/LoadingWrapper", () => ({
  LoadingWrapper: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

import { CryptoBySbom } from "./crypto-by-sbom";

describe("CryptoBySbom", () => {
  beforeEach(() => {
    returnEmpty = false;
  });

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <CryptoBySbom sbomId="test-sbom-id" />
      </MemoryRouter>,
    );

  it("displays the PQC KPI card with correct values", () => {
    renderComponent();

    const card = screen.getByTestId("kpi-pqc");
    expect(card).toHaveTextContent("33%");
    expect(card).toHaveTextContent("1 of 3 inventoried algorithms");
  });

  it("displays the classical algorithm share KPI card with correct values", () => {
    renderComponent();

    const card = screen.getByTestId("kpi-classical");
    expect(card).toHaveTextContent("33%");
    expect(card).toHaveTextContent("1 of 3 algorithms use classical");
  });

  it("renders tabs with item counts", () => {
    renderComponent();

    expect(screen.getByText("Algorithms (3)")).toBeInTheDocument();
    expect(screen.getByText("Keys (1)")).toBeInTheDocument();
  });

  it("renders all 7 algorithm table columns", () => {
    renderComponent();

    expect(screen.getByText("Algorithm name")).toBeInTheDocument();
    expect(screen.getByText("Primitive")).toBeInTheDocument();
    expect(screen.getAllByText("Occurrences").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Policy")).toBeInTheDocument();
    expect(screen.getByText("Recommendation")).toBeInTheDocument();
    expect(screen.getAllByText("Usage").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Packages")).toBeInTheDocument();
  });

  it("renders algorithm data with compliance badges", () => {
    renderComponent();

    expect(screen.getByText("AES-256-GCM")).toBeInTheDocument();
    expect(screen.getByText("RSA-2048")).toBeInTheDocument();
    expect(screen.getByText("SHA-256")).toBeInTheDocument();
    expect(screen.getByText("Compliant")).toBeInTheDocument();
    expect(screen.getByText("Non-compliant")).toBeInTheDocument();
  });

  it("renders parameter set subtitle when present", () => {
    renderComponent();

    expect(screen.getByText("Parameter set 2048")).toBeInTheDocument();
  });

  it("renders pagination controls", () => {
    renderComponent();

    const paginationElements = screen.getAllByLabelText(/pagination/i);
    expect(paginationElements.length).toBeGreaterThan(0);
  });

  it("shows empty state when no algorithms exist", () => {
    returnEmpty = true;
    renderComponent();

    expect(
      screen.getByText("No algorithms found for this SBOM."),
    ).toBeInTheDocument();
  });
});
