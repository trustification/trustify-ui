import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { type Mock, vi } from "vitest";

import { analyzeV3 } from "@app/client";

import { useFetchVulnerabilitiesByPackageIds } from "./vulnerabilities";

vi.mock("@app/client", () => ({
  analyzeV3: vi.fn(),
  getVulnerability: vi.fn(),
  listVulnerabilities: vi.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
};

/** Reads the `purls` array passed to each analyzeV3 call, in call order. */
const purlsPerCall = (): string[][] =>
  (analyzeV3 as Mock).mock.calls.map((call) => call[0].body.purls);

/** Reads the request body of the nth analyzeV3 call. */
const bodyOfCall = (index: number) =>
  (analyzeV3 as Mock).mock.calls[index]?.[0]?.body;

const makeIds = (count: number) =>
  Array.from({ length: count }, (_, i) => `pkg:generic/pkg-${i}`);

describe("useFetchVulnerabilitiesByPackageIds", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (analyzeV3 as Mock).mockResolvedValue({ data: {} });
  });

  it("issues no requests for an empty id list", async () => {
    const { result } = renderHook(
      () => useFetchVulnerabilitiesByPackageIds([]),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(analyzeV3).not.toHaveBeenCalled();
    expect(result.current.analysisResponse).toEqual({});
  });

  it("sends a single request for a single id", async () => {
    const { result } = renderHook(
      () => useFetchVulnerabilitiesByPackageIds(["pkg:generic/only"]),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(purlsPerCall()).toEqual([["pkg:generic/only"]]);
  });

  it("keeps a sub-chunk batch in one request", async () => {
    const ids = makeIds(3);
    const { result } = renderHook(
      () => useFetchVulnerabilitiesByPackageIds(ids),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(purlsPerCall()).toEqual([ids]);
  });

  it("sends exactly one request for exactly 100 ids", async () => {
    const ids = makeIds(100);
    const { result } = renderHook(
      () => useFetchVulnerabilitiesByPackageIds(ids),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    const calls = purlsPerCall();
    expect(calls).toHaveLength(1);
    expect(calls[0]).toEqual(ids);
  });

  it("splits 101 ids into chunks of 100 and 1", async () => {
    const ids = makeIds(101);
    const { result } = renderHook(
      () => useFetchVulnerabilitiesByPackageIds(ids),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    const calls = purlsPerCall();
    expect(calls.map((c) => c.length)).toEqual([100, 1]);
    expect(calls.flat()).toEqual(ids);
  });

  it("splits 250 ids into chunks of 100, 100 and 50 preserving order", async () => {
    const ids = makeIds(250);
    const { result } = renderHook(
      () => useFetchVulnerabilitiesByPackageIds(ids),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    const calls = purlsPerCall();
    expect(calls.map((c) => c.length)).toEqual([100, 100, 50]);
    expect(calls.flat()).toEqual(ids);
  });

  it("omits include_resolved by default and sets it when requested", async () => {
    const { result, rerender } = renderHook(
      ({ resolved }: { resolved: boolean }) =>
        useFetchVulnerabilitiesByPackageIds(["pkg:generic/a"], resolved),
      { wrapper: createWrapper(), initialProps: { resolved: false } },
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(bodyOfCall(0)).toEqual({
      purls: ["pkg:generic/a"],
      include_resolved: undefined,
    });

    rerender({ resolved: true });
    await waitFor(() => expect(result.current.isFetching).toBe(false));
    await waitFor(() => expect(analyzeV3).toHaveBeenCalledTimes(2));
    expect(bodyOfCall(1)).toEqual({
      purls: ["pkg:generic/a"],
      include_resolved: true,
    });
  });

  it("merges the responses of every chunk into a single analysis response", async () => {
    (analyzeV3 as Mock).mockImplementation(
      ({ body }: { body: { purls: string[] } }) =>
        Promise.resolve({
          data: Object.fromEntries(body.purls.map((purl) => [purl, []])),
        }),
    );

    const ids = makeIds(150);
    const { result } = renderHook(
      () => useFetchVulnerabilitiesByPackageIds(ids),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    await waitFor(() =>
      expect(Object.keys(result.current.analysisResponse)).toHaveLength(150),
    );
    expect(Object.keys(result.current.analysisResponse).sort()).toEqual(
      [...ids].sort(),
    );
  });
});
