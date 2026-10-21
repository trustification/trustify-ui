import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  type DrilldownOption,
  DrilldownSelect,
  type SearchQuery,
} from "./DrilldownSelect";

const options: DrilldownOption[] = [
  { id: "alpha", name: "Alpha", hasChildren: true },
  { id: "beta", name: "Beta", hasChildren: true },
];

const renderDrilldownSelect = (
  searchQuery: SearchQuery = { type: "drillIn", parentIds: [] },
) =>
  render(
    <DrilldownSelect
      options={options}
      onChange={vi.fn()}
      isOpen
      setIsOpen={vi.fn()}
      searchQuery={searchQuery}
      onSearchQueryChange={vi.fn()}
    />,
  );

/**
 * Returns the focusable controls (item button + "Drill in" action button)
 * inside the <li> that holds the given menu item, using the same selector as
 * the component's own ArrowRight/ArrowLeft handler.
 */
const focusablesOfRow = (itemName: string) => {
  const itemButton = screen.getByRole("menuitem", { name: itemName });
  const li = itemButton.closest("li");
  if (!li) {
    throw new Error(`No <li> ancestor found for menu item "${itemName}"`);
  }
  return Array.from(
    li.querySelectorAll<HTMLElement>("button:not(:disabled), a:not(:disabled)"),
  );
};

/**
 * These tests deliberately fire the arrow keys WITHOUT first focusing the
 * target element.
 *
 * PatternFly's `Menu` installs its own window-level keydown handler that also
 * moves focus horizontally, but that handler keys off `document.activeElement`
 * whereas DrilldownSelect's own `onKeyDown` keys off `event.target`. Leaving
 * focus on <body> therefore disables PF's handler and makes every focus move
 * below attributable to DrilldownSelect's handler alone. (Verified by
 * mutation: stubbing out the `focus()` call makes these tests fail.)
 */
describe("DrilldownSelect horizontal arrow-key navigation", () => {
  it("moves focus to the next control in the row on ArrowRight", () => {
    renderDrilldownSelect();

    const focusable = focusablesOfRow("Alpha");
    expect(focusable).toHaveLength(2);

    fireEvent.keyDown(focusable[0] as HTMLElement, { key: "ArrowRight" });

    expect(focusable[1]).toHaveFocus();
  });

  it("moves focus back to the previous control in the row on ArrowLeft", () => {
    renderDrilldownSelect();

    const focusable = focusablesOfRow("Alpha");

    fireEvent.keyDown(focusable[1] as HTMLElement, { key: "ArrowLeft" });

    expect(focusable[0]).toHaveFocus();
  });

  it("clamps at the last control in the row on ArrowRight", () => {
    renderDrilldownSelect();

    const focusable = focusablesOfRow("Alpha");

    fireEvent.keyDown(focusable[focusable.length - 1] as HTMLElement, {
      key: "ArrowRight",
    });

    expect(document.activeElement).toBe(document.body);
  });

  it("clamps at the first control in the row on ArrowLeft", () => {
    renderDrilldownSelect();

    const focusable = focusablesOfRow("Alpha");

    fireEvent.keyDown(focusable[0] as HTMLElement, { key: "ArrowLeft" });

    expect(document.activeElement).toBe(document.body);
  });

  it("never crosses into a neighbouring row", () => {
    renderDrilldownSelect();

    const alpha = focusablesOfRow("Alpha");
    const beta = focusablesOfRow("Beta");

    fireEvent.keyDown(alpha[alpha.length - 1] as HTMLElement, {
      key: "ArrowRight",
    });

    expect(beta[0]).not.toHaveFocus();
    expect(document.activeElement).toBe(document.body);
  });

  it("ignores horizontal arrows for rows with a single focusable control", () => {
    // Under a filterText query the rows render without the drill-in action,
    // leaving a single focusable control per row.
    renderDrilldownSelect({ type: "filterText", value: "a" });

    const focusable = focusablesOfRow("Alpha");
    expect(focusable).toHaveLength(1);

    fireEvent.keyDown(focusable[0] as HTMLElement, { key: "ArrowRight" });

    expect(document.activeElement).toBe(document.body);
  });

  it("ignores events whose target is not one of the row's focusable controls", () => {
    renderDrilldownSelect();

    const li = screen
      .getByRole("menuitem", { name: "Alpha" })
      .closest("li") as HTMLElement;

    fireEvent.keyDown(li, { key: "ArrowRight" });

    expect(document.activeElement).toBe(document.body);
  });

  it("leaves focus untouched for keys other than ArrowRight/ArrowLeft", () => {
    renderDrilldownSelect();

    const focusable = focusablesOfRow("Alpha");

    fireEvent.keyDown(focusable[0] as HTMLElement, { key: "a" });

    expect(document.activeElement).toBe(document.body);
  });

  it("moves focus for a genuinely focused control too", () => {
    // Realistic end-to-end variant: PatternFly's handler is also active here,
    // so this asserts the user-visible outcome rather than isolating our code.
    renderDrilldownSelect();

    const focusable = focusablesOfRow("Alpha");
    (focusable[0] as HTMLElement).focus();

    fireEvent.keyDown(focusable[0] as HTMLElement, { key: "ArrowRight" });

    expect(focusable[1]).toHaveFocus();
  });
});
