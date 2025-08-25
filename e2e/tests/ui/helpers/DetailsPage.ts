import { expect, Locator, Page } from "@playwright/test";

/**
 * Describes the Details of an Entity. E.g. SBOM Details Page.
 * Generally based on https://www.patternfly.org/extensions/component-groups/details-page/
 */
export class DetailsPage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async selectTab(tabName: string) {
    const tab = this.page.locator("button[role='tab']", { hasText: tabName });
    await expect(tab).toBeVisible();
    await tab.click();
  }

  async clickOnPageAction(actionName: string) {
    await this.page.getByRole("button", { name: "Actions" }).click();
    await this.page.getByRole("menuitem", { name: actionName }).click();
  }

  async verifyPageHeader(header: string) {
    await expect(this.page.getByRole("heading")).toContainText(header);
  }

  async verifyTabIsSelected(tabName: string) {
    await expect(this.page.getByRole("tab", { name: tabName })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  }

  async verifyTabIsVisible(tabName: string) {
    await expect(this.page.getByRole("tab", { name: tabName })).toBeVisible();
  }

  async verifyTabIsNotVisible(tabName: string) {
    await expect(this.page.getByRole("tab", { name: tabName })).toHaveCount(0);
  }

  //Wait for Loading Spinner to detach from the DOM
  async waitForData() {
    const spinner = this.page.locator(`xpath=(//table//tbody)[1]`);
    await spinner.waitFor({ state: "visible", timeout: 5000 });
  }

  //Verifies the Page loads with data
  async verifyDataAvailable() {
    await expect(
      this.page.locator(
        `xpath=//div[(.='No data available to be shown here.')]`,
      ),
    ).toHaveCount(0);
  }

  //Verifies the Vulnerability counts from summary to table
  async verifyVulnerabilityPanelcount() {
    const pieVulnSevLabel = `xpath=//*[name()='svg']/*[name()='g']//*[name()='tspan']`;
    const totalVuln = `xpath=//*[name()='svg']/*[name()='text']//*[name()='tspan'][1]`;
    const totalVulnElement = this.page.locator(totalVuln);
    await totalVulnElement.waitFor({ state: "visible", timeout: 5000 });
    const totalVulnPanel = await totalVulnElement.textContent();
    const panelVulnSev = await this.getCountFromLabels(pieVulnSevLabel, ":");
    const sumPanelVulnSev = await Object.values(panelVulnSev).reduce(
      (sum, value) => sum + value,
      0,
    );
    const tableVulnSev = await this.getCVSSCountFromVulnTable();
    let mismatch = false;
    await expect(
      // biome-ignore lint/style/noNonNullAssertion: allowed
      parseInt(totalVulnPanel!, 10),
      `Total Vulnerabilities count ${totalVulnPanel} mismatches with sum of individual ${sumPanelVulnSev}`,
    ).toEqual(sumPanelVulnSev);

    for (const severity in tableVulnSev) {
      if (panelVulnSev[severity] !== undefined) {
        if (panelVulnSev[severity] !== tableVulnSev[severity]) {
          console.log(
            `${severity} count mismatch. Summary panel count ${panelVulnSev[severity]}, Rows count ${tableVulnSev[severity]}`,
          );
          mismatch = true;
        }
      }
    }
    await expect(mismatch, "Panel count mismatches to table count").not.toBe(
      true,
    );
  }

  /**
   * Get all the Elements matching to the @param labelLocator and retrieves the textContext of each element
   * Splits the text with @param delimiter
   * @returns the mutable object { [key: 0th_element ]: 1st_element }
   */
  async getCountFromLabels(
    labelLocator: string,
    delimiter: string,
  ): Promise<{ [key: string]: number }> {
    const elements = await this.page.locator(labelLocator).all();
    let vulnLabelCount: { [key: string]: number } = {};
    for (const element of elements) {
      const innerText = await element.textContent();
      const labelArr = await innerText?.split(delimiter);
      vulnLabelCount[labelArr[0].trim().toString()] = parseInt(
        labelArr[1].trim(),
        10,
      );
    }
    return vulnLabelCount;
  }

  /**
   * Retrieves the CVSS value from each row of Vulnerability table
   * @returns Count of each CVSS type in { [key: severity ]: count }
   */

  async getCVSSCountFromVulnTable(): Promise<{ [key: string]: number }> {
    let nextPage = true;
    const counts = {
      Unknown: 0,
      None: 0,
      Low: 0,
      Medium: 0,
      High: 0,
      Critical: 0,
    };
    const nextButton = await this.page.locator(
      `xpath=(//section[@id='refVulnerabilitiesSection']//button[@data-action='next'])[1]`,
    );

    const noOfRows = await this.page.locator(
      `xpath=//section[@id="refVulnerabilitiesSection"]//button[@id="pagination-id-top-toggle"]`,
    );
    if (await noOfRows.isEnabled()) {
      noOfRows.click();
      await this.page.getByRole("menuitem", { name: "100 per page" }).click();
    }

    while (nextPage) {
      for (let cvssType of Object.keys(counts) as Array<keyof typeof counts>) {
        const cvssLocator = await this.page
          .locator(`xpath=//td[@data-label='CVSS']//div[.='${cvssType}']`)
          .all();
        counts[cvssType] += await cvssLocator.length;
      }
      nextPage = await nextButton.isEnabled();
      if (nextPage) {
        await nextButton.click();
      }
    }
    return counts;
  }
  /**
   * Generates a random String with length of 6
   */
  public randomString(length: number = 6): string {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from(
      { length },
      () => chars[Math.floor(Math.random() * chars.length)],
    ).join("");
  }

  /**
   * Generates randomized labels for SBOM list page testing
   */
  public generateLabels(): string {
    return `label_${this.randomString()}, key_${this.randomString(3)}=qe_${this.randomString(3)}`;
  }

  /**
   * To click on Edit labels button on Details page
   */
  async editLabelsDetailsPage() {
    await this.selectTab(`Info`);
    await this.page.getByRole("button", { name: "Edit" }).click();
  }

  /**
   * To add labels to edit model window
   * @param labels List of labels to add to the entity
   */
  async addLabels(labelList: string) {
    let labels = labelList.split(",").map((label) => label.trim());
    await this.page.getByText("Edit labels").isVisible();
    for (let label of labels) {
      await this.page.getByPlaceholder("Add label").fill(label);
      await this.page.getByPlaceholder("Add label").press("Enter");
    }
    await this.page.getByLabel("submit").click();
  }

  /**
   * To verify the given labels exist with the Entity
   * @param labels List of expected labels
   * @param entity Entity name to which the Labels needs to be verified
   * @param parentElem Parent element to identify the Labels element - Defaults to List page table rows
   */
  async verifyLabels(
    labelList: string,
    entity: string = "",
    parentElem: Locator | undefined = undefined,
  ) {
    let labels = labelList.split(",").map((label) => label.trim());

    if (!parentElem) {
      parentElem = this.page.locator(`xpath=//td[.='${entity}']/parent::tr/td`);
    }

    const moreElem = parentElem.getByRole("button", { name: "more" });
    if (await moreElem.isVisible({ timeout: 2000 })) {
      await moreElem.click();
    }
    // Wait for Edit label modal window to close with retry
    const editLabels = this.page.getByText("Edit labels");
    if (await editLabels.isVisible({ timeout: 1000 })) {
      await editLabels.waitFor({ state: "hidden", timeout: 5000 });
    }
    // Wait for labels container to be stable
    const labelContainer = parentElem.locator(
      `xpath=//ul[@aria-label='Label group category']`,
    );
    await expect(labelContainer).toBeVisible({ timeout: 5000 });
    let max_attempts = 0;
    let labelFound = true;
    let labelExpected = [...labels];
    while (max_attempts < 3 && labelFound) {
      max_attempts++;
      for (const label of labels) {
        try {
          const labelUI = await parentElem.locator(
            `xpath=//ul[@aria-label='Label group category']/li[.='${label}']`,
          );
          await expect(labelUI).toBeVisible({ timeout: 2000 });
          labelExpected = labelExpected.filter(
            (labelTemp) => labelTemp !== label,
          );
        } catch {
          await this.page.waitForTimeout(500);
        }
      }
      if (labelExpected.length === 0) {
        labelFound = false;
      }
    }
    expect(
      labelExpected.length,
      `Labels missing from the given list: ${labelExpected.join(", ")}`,
    ).toBe(0);
  }
}
