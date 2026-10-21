import { createRef } from "react";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { SearchInputComponent, type SearchInputProps } from "./SearchInput";
import type { AutocompleteOptionProps } from "./type-utils";

/**
 * Characterization tests for `SearchInputComponent.getHint()`.
 *
 * PatternFly renders the hint as a second, disabled, aria-hidden <input>
 * sibling of the real text input, and renders nothing at all when the hint
 * string is empty. That makes the presence/value of that element a faithful
 * read-out of what `getHint()` returned.
 */
const getHintValue = (container: HTMLElement): string | null => {
  const hintInput = container.querySelector<HTMLInputElement>(
    'input[aria-hidden="true"]',
  );
  return hintInput ? hintInput.value : null;
};

const renderSearchInput = (overrides: Partial<SearchInputProps> = {}) => {
  const props: SearchInputProps = {
    id: "test-search-input",
    placeholder: "Search",
    ariaLabel: "Search input",
    onSearchChange: vi.fn(),
    onClear: vi.fn(),
    onKeyHandling: vi.fn(),
    onClick: vi.fn(),
    inputValue: "",
    inputRef: createRef<HTMLInputElement>(),
    options: [],
    isDropdownOpen: false,
    activeItem: null,
    ...overrides,
  };

  return render(<SearchInputComponent {...props} />);
};

const option = (
  id: string,
  name: AutocompleteOptionProps["name"],
): AutocompleteOptionProps => ({ id, name });

describe("Autocomplete SearchInputComponent getHint", () => {
  it("renders no hint when there are no options", () => {
    const { container } = renderSearchInput({
      options: [],
      inputValue: "ap",
    });

    expect(getHintValue(container)).toBeNull();
  });

  it("renders the completed hint for a single prefix-matching option", () => {
    const { container } = renderSearchInput({
      options: [option("apple", "Apple")],
      inputValue: "ap",
    });

    // The typed prefix is preserved verbatim and only the remainder of the
    // option name is appended -> "ap" + "ple".
    expect(getHintValue(container)).toBe("apple");
  });

  it("resolves a function-valued option name when building the hint", () => {
    const { container } = renderSearchInput({
      options: [option("banana", () => "Banana")],
      inputValue: "Ban",
    });

    expect(getHintValue(container)).toBe("Banana");
  });

  it("renders no hint when the single option does not start with the input", () => {
    const { container } = renderSearchInput({
      options: [option("apple", "Apple")],
      inputValue: "pl",
    });

    expect(getHintValue(container)).toBeNull();
  });

  it("renders no hint when the input is empty", () => {
    const { container } = renderSearchInput({
      options: [option("apple", "Apple")],
      inputValue: "",
    });

    expect(getHintValue(container)).toBeNull();
  });

  it("renders no hint when more than one option is available", () => {
    const { container } = renderSearchInput({
      options: [option("apple", "Apple"), option("apricot", "Apricot")],
      inputValue: "ap",
    });

    expect(getHintValue(container)).toBeNull();
  });

  it("still renders the live input and wires aria-activedescendant from activeItem", () => {
    const activeItem = option("apple", "Apple");
    const { container } = renderSearchInput({
      options: [activeItem],
      inputValue: "ap",
      activeItem,
    });

    const liveInput = container.querySelector<HTMLInputElement>(
      'input[role="combobox"]',
    );
    expect(liveInput).not.toBeNull();
    expect(liveInput).toHaveAttribute("aria-activedescendant", "apple");
    expect(liveInput).toHaveValue("ap");
  });
});
