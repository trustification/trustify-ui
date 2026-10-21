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

import { Autocomplete } from "./Autocomplete";
import type { AutocompleteOptionProps } from "./type-utils";
import { useAutocompleteHandlers } from "./useAutocompleteHandlers";

const keyEvent = (key: string) =>
  ({
    key,
    preventDefault: vi.fn(),
  }) as unknown as React.KeyboardEvent<HTMLInputElement>;

const option = (
  id: string,
  extra: Partial<AutocompleteOptionProps> = {},
): AutocompleteOptionProps => ({ id, name: id, ...extra });

const renderHandlers = (
  overrides: Partial<Parameters<typeof useAutocompleteHandlers>[0]> = {},
) => {
  const onChange = vi.fn();
  const onCreateNewOption = vi.fn((value: string) => option(value));

  const hook = renderHook(() =>
    useAutocompleteHandlers({
      options: [],
      searchString: "",
      selections: [],
      onChange,
      menuRef: createRef<HTMLDivElement>(),
      searchInputRef: createRef<HTMLDivElement>(),
      onCreateNewOption,
      ...overrides,
    }),
  );

  return { ...hook, onChange, onCreateNewOption };
};

describe("useAutocompleteHandlers arrow-key navigation", () => {
  it("activates the first option on ArrowDown while the dropdown is closed", () => {
    const options = [option("a"), option("b"), option("c")];
    const { result } = renderHandlers({ options });

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

  it("falls through to create-new-option on Enter when no active item was resolved", () => {
    const options = [
      option("a"),
      option("b", { optionProps: { isDisabled: true } }),
    ];
    const { result, onCreateNewOption, onChange } = renderHandlers({ options });

    act(() => {
      result.current.handleInputChange("zz");
    });
    act(() => {
      result.current.handleKeyDown(keyEvent("ArrowUp"));
    });
    act(() => {
      result.current.handleKeyDown(keyEvent("Enter"));
    });

    expect(onCreateNewOption).toHaveBeenCalledWith("zz");
    expect(onChange).toHaveBeenCalledWith([option("zz")]);
  });

  it("selects the active item on Enter", () => {
    const options = [option("a"), option("b")];
    const { result, onChange, onCreateNewOption } = renderHandlers({ options });

    act(() => {
      result.current.handleKeyDown(keyEvent("ArrowDown"));
    });
    act(() => {
      result.current.handleKeyDown(keyEvent("Enter"));
    });

    expect(onChange).toHaveBeenCalledWith([options[0]]);
    expect(onCreateNewOption).not.toHaveBeenCalled();
  });

  it("clears the active item on Escape", () => {
    const options = [option("a"), option("b")];
    const { result } = renderHandlers({ options });

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

describe("Autocomplete arrow-key navigation (rendered)", () => {
  it("exposes the arrow-key active item through aria-activedescendant", () => {
    render(
      <Autocomplete
        options={[option("alpha"), option("beta")]}
        onChange={vi.fn()}
      />,
    );

    const input = screen.getByRole("combobox", { name: "Search input" });
    expect(input).not.toHaveAttribute("aria-activedescendant");

    // While the dropdown is closed every ArrowDown resolves to index 0.
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(input).toHaveAttribute("aria-activedescendant", "alpha");

    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(input).toHaveAttribute("aria-activedescendant", "alpha");

    // Opening the dropdown lets ArrowDown advance through the list.
    fireEvent.click(input);
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(input).toHaveAttribute("aria-activedescendant", "beta");

    fireEvent.keyDown(input, { key: "Escape" });
    expect(input).not.toHaveAttribute("aria-activedescendant");
  });
});
