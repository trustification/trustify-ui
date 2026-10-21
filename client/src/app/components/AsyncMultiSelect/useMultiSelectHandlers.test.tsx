import type React from "react";
import { createRef } from "react";
import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
} from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AsyncMultiSelect } from "./AsyncMultiSelect";
import type { AsyncMultiSelectOptionProps } from "./type-utils";
import { useAutocompleteHandlers } from "./useMultiSelectHandlers";

const keyEvent = (key: string) =>
  ({
    key,
    preventDefault: vi.fn(),
  }) as unknown as React.KeyboardEvent<HTMLInputElement>;

const option = (
  id: string,
  extra: Partial<AsyncMultiSelectOptionProps> = {},
): AsyncMultiSelectOptionProps => ({ id, name: id, ...extra });

const renderHandlers = (
  overrides: Partial<Parameters<typeof useAutocompleteHandlers>[0]> = {},
) => {
  const onChange = vi.fn();

  const hook = renderHook(() =>
    useAutocompleteHandlers({
      options: [],
      searchString: "",
      selections: [],
      onChange,
      menuRef: createRef<HTMLDivElement>(),
      searchInputRef: createRef<HTMLDivElement>(),
      ...overrides,
    }),
  );

  return { ...hook, onChange };
};

describe("useMultiSelectHandlers arrow-key navigation", () => {
  it("does not navigate while the dropdown is closed, it only opens it", () => {
    const options = [option("a"), option("b")];
    const { result } = renderHandlers({ options });

    act(() => {
      result.current.handleKeyDown(keyEvent("ArrowDown"));
    });

    expect(result.current.isDropdownOpen).toBe(true);
    expect(result.current.focusedItemIndex).toBeNull();
    expect(result.current.activeItem).toBeNull();
  });

  it("activates the first option on ArrowDown once the dropdown is open", () => {
    const options = [option("a"), option("b"), option("c")];
    const { result } = renderHandlers({ options });

    act(() => {
      result.current.setIsDropdownOpen(true);
    });
    act(() => {
      result.current.handleKeyDown(keyEvent("ArrowDown"));
    });

    expect(result.current.focusedItemIndex).toBe(0);
    expect(result.current.activeItem).toEqual(options[0]);
  });

  it("walks forward through the options on repeated ArrowDown", () => {
    const options = [option("a"), option("b"), option("c")];
    const { result } = renderHandlers({ options });

    act(() => {
      result.current.setIsDropdownOpen(true);
    });
    act(() => {
      result.current.handleKeyDown(keyEvent("ArrowDown"));
    });
    act(() => {
      result.current.handleKeyDown(keyEvent("ArrowDown"));
    });

    expect(result.current.focusedItemIndex).toBe(1);
    expect(result.current.activeItem).toEqual(options[1]);
  });

  it("wraps to the last option on ArrowUp from an unfocused list", () => {
    const options = [option("a"), option("b"), option("c")];
    const { result } = renderHandlers({ options });

    act(() => {
      result.current.setIsDropdownOpen(true);
    });
    act(() => {
      result.current.handleKeyDown(keyEvent("ArrowUp"));
    });

    expect(result.current.focusedItemIndex).toBe(2);
    expect(result.current.activeItem).toEqual(options[2]);
  });

  it("skips disabled options when resolving the active item", () => {
    const options = [
      option("a", { optionProps: { isDisabled: true } }),
      option("b"),
    ];
    const { result } = renderHandlers({ options });

    act(() => {
      result.current.setIsDropdownOpen(true);
    });
    act(() => {
      result.current.handleKeyDown(keyEvent("ArrowDown"));
    });

    expect(result.current.focusedItemIndex).toBe(0);
    expect(result.current.activeItem).toEqual(options[1]);
  });

  it("leaves no active item when the focused index falls past the enabled options", () => {
    // focusedItemIndex is computed against the full option list while the
    // active item is resolved against the *enabled* subset, so ArrowUp here
    // asks for index 1 of a one-element array.
    const options = [
      option("a"),
      option("b", { optionProps: { isDisabled: true } }),
    ];
    const { result } = renderHandlers({ options });

    act(() => {
      result.current.setIsDropdownOpen(true);
    });
    act(() => {
      result.current.handleKeyDown(keyEvent("ArrowUp"));
    });

    expect(result.current.focusedItemIndex).toBe(1);
    expect(result.current.activeItem).toBeFalsy();
  });

  // INTENTIONAL BEHAVIOR CHANGE (noUncheckedIndexedAccess fix).
  //
  // `handleMenuArrowKeys` used to store the raw `options[...][indexToFocus]`
  // lookup, so an out-of-range index left `activeItem === undefined`. The
  // Enter branch then tested `activeItem !== null`, which is true for
  // `undefined`, and pushed that `undefined` into the selection list:
  // `onChange` was previously called with `[undefined]`.
  //
  // Normalising the lookup to `?? null` makes the existing `!== null` guard
  // work as intended, so Enter is now a no-op in this state.
  it("does not select anything on Enter when the focused index fell past the enabled options", () => {
    const options = [
      option("a"),
      option("b", { optionProps: { isDisabled: true } }),
    ];
    const { result, onChange } = renderHandlers({ options });

    act(() => {
      result.current.setIsDropdownOpen(true);
    });
    act(() => {
      result.current.handleKeyDown(keyEvent("ArrowUp"));
    });
    act(() => {
      result.current.handleKeyDown(keyEvent("Enter"));
    });

    // BEHAVIOR CHANGE: the out-of-range index previously left activeItem as
    // `undefined`, which the `activeItem !== null` guard let through, pushing a
    // bogus `undefined` into the selection. `?? null` makes the guard work.
    expect(onChange).not.toHaveBeenCalled();
  });

  it("toggles the active item on Enter", () => {
    const options = [option("a"), option("b")];
    const { result, onChange } = renderHandlers({ options });

    act(() => {
      result.current.setIsDropdownOpen(true);
    });
    act(() => {
      result.current.handleKeyDown(keyEvent("ArrowDown"));
    });
    act(() => {
      result.current.handleKeyDown(keyEvent("Enter"));
    });

    expect(onChange).toHaveBeenCalledWith([options[0]]);
  });

  it("clears the active item on Escape", () => {
    const options = [option("a"), option("b")];
    const { result } = renderHandlers({ options });

    act(() => {
      result.current.setIsDropdownOpen(true);
    });
    act(() => {
      result.current.handleKeyDown(keyEvent("ArrowDown"));
    });
    expect(result.current.activeItem).toEqual(options[0]);

    act(() => {
      result.current.handleKeyDown(keyEvent("Escape"));
    });

    expect(result.current.activeItem).toBeNull();
    expect(result.current.isDropdownOpen).toBe(false);
  });
});

describe("AsyncMultiSelect arrow-key navigation (rendered)", () => {
  it("exposes the arrow-key active item through aria-activedescendant", () => {
    render(
      <AsyncMultiSelect
        options={[option("alpha"), option("beta")]}
        onChange={vi.fn()}
      />,
    );

    const input = screen.getByRole("combobox", { name: "Search input" });
    expect(input).not.toHaveAttribute("aria-activedescendant");

    // The first ArrowDown only opens the dropdown.
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(input).not.toHaveAttribute("aria-activedescendant");

    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(input).toHaveAttribute("aria-activedescendant", "alpha");

    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(input).toHaveAttribute("aria-activedescendant", "beta");

    fireEvent.keyDown(input, { key: "Escape" });
    expect(input).not.toHaveAttribute("aria-activedescendant");
  });
});
