import { act, renderHook } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { useTabState } from "./useTabState";

// usePersistentState always calls useUrlParams, which needs a router in context.
const wrapper = ({ children }: PropsWithChildren) => (
  <MemoryRouter>{children}</MemoryRouter>
);

describe("useTabState", () => {
  /** Pins that, with no explicit defaultActiveTab, the first entry of tabKeys is active. */
  it("should activate the first tabKey when no defaultActiveTab is given", () => {
    // Given tab keys with no explicit default
    const { result } = renderHook(
      () => useTabState({ tabKeys: ["info", "vulnerabilities"] }),
      { wrapper },
    );

    // Then the first key is active
    expect(result.current.activeTab).toEqual({ tabKey: "info" });
  });

  /** Pins that an explicit defaultActiveTab wins over the first entry of tabKeys. */
  it("should prefer an explicit defaultActiveTab over the first tabKey", () => {
    // Given an explicit default that is not the first key
    const { result } = renderHook(
      () =>
        useTabState({
          tabKeys: ["info", "packages", "vulnerabilities"],
          defaultActiveTab: { tabKey: "vulnerabilities" },
        }),
      { wrapper },
    );

    // Then the explicit default is active
    expect(result.current.activeTab).toEqual({ tabKey: "vulnerabilities" });
  });

  /**
   * Pins that an explicit defaultActiveTab is honoured even when it is not a member
   * of tabKeys (the hook does no validation today).
   */
  it("should honour a defaultActiveTab that is absent from tabKeys", () => {
    // Given a default that is not part of tabKeys
    const { result } = renderHook(
      () =>
        useTabState({
          tabKeys: ["info", "packages"],
          defaultActiveTab: { tabKey: "somethingElse" },
        }),
      { wrapper },
    );

    // Then it is still the active tab
    expect(result.current.activeTab).toEqual({ tabKey: "somethingElse" });
  });

  /** Pins that setActiveTab replaces the active tab. */
  it("should replace the active tab via setActiveTab", () => {
    // Given the default active tab
    const { result } = renderHook(
      () => useTabState({ tabKeys: ["info", "vulnerabilities"] }),
      { wrapper },
    );
    expect(result.current.activeTab).toEqual({ tabKey: "info" });

    // When selecting another tab
    act(() => {
      result.current.setActiveTab({ tabKey: "vulnerabilities" });
    });

    // Then that tab is active
    expect(result.current.activeTab).toEqual({ tabKey: "vulnerabilities" });
  });

  /**
   * BEHAVIOR CHANGE: this previously produced the bogus object
   * { tabKey: undefined }; it now produces null, which ITabState already allows
   * and which consumers (getTabDerivedState / useTabControls) already handle via
   * `activeTab?.tabKey` -- so they see undefined either way.
   * No real call site passes an empty tabKeys array.
   */
  it("should have no active tab when tabKeys is empty", () => {
    // Given no tab keys at all
    const { result } = renderHook(() => useTabState({ tabKeys: [] }), {
      wrapper,
    });

    // Then there is no active tab
    expect(result.current.activeTab).toBeNull();
  });
});
