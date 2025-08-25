import type { Locator, Page } from "playwright-core";
import { expect } from "playwright/test";

export class LabelsModal {
  private _dialog: Locator;

  private constructor(_page: Page, dialog: Locator) {
    this._dialog = dialog;
  }

  static async build(page: Page) {
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    return new LabelsModal(page, dialog);
  }

  async clickSave() {
    await this._dialog.locator("button[aria-label='submit']").click();
    await expect(this._dialog).not.toBeVisible();
  }

  async addLabels(labels: string[]) {
    const inputText = this._dialog.getByPlaceholder("Add label");

    for (const label of labels) {
      await inputText.click();
      await inputText.fill(label);
      await inputText.press("Enter");
    }
  }

  async removeLabels(labels: string[]) {
    for (const label of labels) {
      await this._dialog
        .locator(".pf-v6-c-label-group__list-item", {
          hasText: label,
        })
        .locator("button")
        .click();
    }
  }
}
