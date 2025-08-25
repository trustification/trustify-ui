import { expect, type Page } from "@playwright/test";
import { fail } from "node:assert";

export class ToolbarTable {
  private _page: Page;
  private _tableName: string;

  constructor(page: Page, tableName: string) {
    this._page = page;
    this._tableName = tableName;
  }

  async verifyPaginationHasTotalResults(totalResults: number) {
    const paginationTop = this._page.locator("#pagination-id-top-toggle");
    await expect(paginationTop.locator("b").nth(1)).toHaveText(
      `${totalResults}`,
    );
  }

  async verifyPaginationHasTotalResultsGreatherThan(
    totalResults: number,
    include: boolean = false,
  ) {
    const paginationTop = this._page.locator("#pagination-id-top-toggle");
    const totalResultsText = await paginationTop
      .locator("b")
      .nth(1)
      .textContent();
    if (include) {
      expect(Number(totalResultsText)).toBeGreaterThanOrEqual(totalResults);
    } else {
      expect(Number(totalResultsText)).toBeGreaterThan(totalResults);
    }
  }

  async filterByText(filterText: string) {
    const input = this._page.locator("#search-input");
    await input.fill(filterText);
    await input.press("Enter");
  }

  async verifyTableIsSortedBy(columnName: string, asc: boolean = true) {
    const table = this.getTable();
    await expect(
      table.getByRole("columnheader", { name: columnName }),
    ).toHaveAttribute("aria-sort", asc ? "ascending" : "descending");
  }

  // biome-ignore lint/suspicious/noExplicitAny: allowed
  async verifyColumnContainsText(columnName: any, expectedValue: any) {
    const table = this.getTable();
    await expect(table.locator(`td[data-label="${columnName}"]`)).toContainText(
      expectedValue,
    );
  }

  /**
   * Verifies the pagination count against per page selection
   * @param parentElem required to identify the pagination across sections
   * Example, SBOM Explorer - Vulnerabilities and Packages section top and bottom sections.
   * Parent Element for Vulnerabilities section top Pagination `//div[@id="vulnerability-table-pagination-top"]`
   * And bottom section `//div[@id="vulnerability-table-pagination-bottom"]`
   */
  async verifyPagination(parentElem: string) {
    const perPageValues = [10, 20, 50, 100];
    const totalRows = await this.getTotalRowsFromPagination(parentElem);
    for (const value of perPageValues) {
      await this.goToFirstPage(parentElem);
      let expectedPagecount = Math.trunc(totalRows / value);
      const remainingRows = totalRows % value;
      if (remainingRows > 0) {
        expectedPagecount += 1;
      }
      await this.selectPerPage(parentElem, `${value} per page`);
      const progressBar = this._page.getByRole("gridcell", {
        name: "Loading...",
      });
      await progressBar.waitFor({ state: "hidden", timeout: 5000 });
      const actualPageCount =
        await this.getTotalPagesFromNavigation(parentElem);
      await expect(actualPageCount, "Page count mismatches").toEqual(
        expectedPagecount,
      );
      await this.navigateToEachPageVerifyRowsCount(
        parentElem,
        expectedPagecount,
        value,
        remainingRows,
      );
    }
  }

  /**
   * Retrieves the Total page count from pagination
   * @param parentElem required to identify the pagination across sections
   * @returns total count from pagination text
   */
  async getTotalPagesFromNavigation(parentElem: string): Promise<number> {
    const section = this._page.locator(parentElem);
    const navTotal = await section.locator(
      `xpath=//span[contains(@class,'form-control')]/following-sibling::span`,
    );
    const totalPages = await navTotal.textContent();
    // biome-ignore lint/style/noNonNullAssertion: allowed
    return parseInt(totalPages!.replace("of", "").trim(), 10);
  }

  /**
   * Retrieves the Total Row count from pagination
   * @param parentElem required to differentiate top and bottom pagination
   * @returns total row count from pagination dropdown
   */
  async getTotalRowsFromPagination(parentElem: string): Promise<number> {
    await this.waitForTableContent();
    const pagination = this._page.locator(parentElem);
    const totalResultsText = await pagination
      .locator(`xpath=//button//b[not(contains (.,'-'))]`)
      .textContent();
    // biome-ignore lint/style/noNonNullAssertion: allowed
    return parseInt(totalResultsText!.trim(), 10);
  }

  /**
   * Selects Number of rows per page on the table
   * @param perPage Number of rows
   */
  async selectPerPage(parentElem: string, perPage: string) {
    const pagination = this._page.locator(parentElem);
    await pagination.locator(`//button[@aria-haspopup='listbox']`).click();
    await this._page.getByRole("menuitem", { name: perPage }).click();
  }

  /**
   * Verifies Number of rows on the table equals to or lesser than the row count given
   * @param rowsCount Number of rows
   */
  async verifyPerPageToRowCount(rowsCount: number) {
    const table = this.getTable();
    const rows = await table.locator(`xpath=//tbody/tr`);
    const tabRows = await rows.count();
    // Bug: https://issues.redhat.com/browse/TC-2353
    await expect(tabRows).toEqual(rowsCount);
  }

  /**
   * Navigates to Each page with Next button and verify the rows count
   * @param parentElem required to identify the pagination across sections
   * @param pageCount Number of Pages expected
   * @param perPageRows Number of rows expected per page
   * @param remainingRows Number of rows in Last Page
   */
  async navigateToEachPageVerifyRowsCount(
    parentElem: string,
    pageCount: number,
    perPageRows: number,
    remainingRows: number,
  ) {
    const section = this._page.locator(parentElem);
    const nextButton = await section.getByLabel("Go to next page");
    let expMinCount = 1;
    let expMaxCount = perPageRows;
    if (pageCount === 1) {
      expMaxCount = remainingRows;
    }
    for (let i = 1; i < pageCount; i++) {
      await this.verifyRowsCounterPagination(
        parentElem,
        expMinCount,
        expMaxCount,
      );
      await this.verifyPerPageToRowCount(perPageRows);
      await nextButton.isEnabled();
      await nextButton.click();
      const progressBar = this._page.getByRole("gridcell", {
        name: "Loading...",
      });
      await progressBar.waitFor({ state: "hidden", timeout: 5000 });
      expMinCount += perPageRows;
      if (i === pageCount - 1) {
        expMaxCount = expMaxCount + remainingRows;
      } else {
        expMaxCount += perPageRows;
      }
    }
    if (remainingRows > 0) {
      await this.verifyPerPageToRowCount(remainingRows);
      await this.verifyRowsCounterPagination(
        parentElem,
        expMinCount,
        expMaxCount,
      );
    }
    await nextButton.isDisabled();
  }

  /**
   * Verifies the Pagination Row Count
   * Example, in pagination counter `1-10 of 61` - it verifies the @param expMinCount equals to 1 and @param expMaxCount equals to 10
   * @param parentElem required to differentiate top and bottom pagination
   * @param expMinCount Expected Min count on the counter
   * @param expMaxCount Expected Max count on the counter
   */
  async verifyRowsCounterPagination(
    parentElem: string,
    expMinCount: number,
    expMaxCount: number,
  ) {
    const pagination = this._page.locator(parentElem);
    const pageCounter = await pagination.locator(
      `xpath=//button//b[contains (.,"-")]`,
    );
    const counterText = await pageCounter.textContent();
    // biome-ignore lint/style/noNonNullAssertion: allowed
    const [min, max] = counterText!
      .split("-")
      .map((value) => parseInt(value.trim()));
    await expect(min).toEqual(expMinCount);
    await expect(max).toEqual(expMaxCount);
  }

  /**
   * Verifies the columnHeader given is visible
   * @param columnHeader Table Column Header
   */
  async verifyTableHeaderContains(columnHeader: string) {
    const table = this.getTable();
    await table.getByRole("columnheader", { name: columnHeader }).isVisible();
  }

  /**
   * Verifies the given Table header doesn't have sortable attribute
   * @param columnHeader Table Column Header
   */
  async verifyColumnIsNotSortable(columnHeader: string) {
    //const table = this.getTable();
    const elem = await this._page.getByRole("columnheader", {
      name: `${columnHeader}`,
    });
    await elem.click();
    await expect(elem).not.toHaveAttribute("aria-label");
  }

  /**
   * Navigate to the First page of the WebTable
   * @param parentElem ParentElement to identify Pagination
   */
  async goToFirstPage(parentElem: string) {
    const firstPage = this._page.locator(parentElem).getByRole("button", {
      name: "Go to first page",
    });
    if (await firstPage.isEnabled()) {
      await firstPage.click();
    }
  }

  /**
   * Wait for Table data - Check for Table Error not occurs and Wait for 5000ms
   */
  async waitForTableContent() {
    const tableError = this._page.locator(
      `xpath=(//tbody[@aria-label="Table error"])[1]`,
    );
    if (await tableError.isVisible()) {
      await expect(tableError, "No Data available").not.toBeVisible();
    }
    const progressBar = this._page.getByRole("gridcell", {
      name: "Loading...",
    });
    await progressBar.waitFor({ state: "hidden", timeout: 10000 });
  }

  /**
   * Retrieve Table header and Row values in array
   * @param parentElem ParentElement of pagination
   * @returns two dimensional string which contains the contents of table
   */
  async getTableRows(parentElem: string): Promise<string[][]> {
    const nextPageElem = await this._page
      .locator(parentElem)
      .getByLabel("Go to next page");
    let isNextPageEnabled = true;
    const tableData: string[][] = [];
    await this.goToFirstPage(parentElem);
    while (isNextPageEnabled) {
      const table_data = await this.getTable();
      const allRows = await table_data.locator(`tr`).all();
      for (const row of allRows) {
        const rowData = await row.locator(`th, td`).allTextContents();
        tableData.push(rowData);
      }
      isNextPageEnabled = await nextPageElem.isEnabled();
    }
    return tableData;
  }

  /**
   * Sort table for the given column index and sorting order
   * @param table Source table for Sorting
   * @param header Target header to be sorted
   * @param sorting sorting order
   * @returns tow dimensional array containing sorted table based on the given column in given sorting order
   */
  async sortTable(
    table: string[][],
    header: string,
    sorting: string = `ascending`,
  ): Promise<string[][]> {
    const headerRow = table[0];
    const dataRow = table.slice(1);
    const index = headerRow.indexOf(header);
    let row = 0;
    if (index < 0) {
      fail("Given header not found");
    }
    for (const data of dataRow) {
      if (data[index] !== ``) {
        row += 1;
        break;
      }
    }
    const isDate = this.isValidDate(dataRow[row][index]);
    const isCVSS = this.isCVSS(dataRow[row][index]);
    const isCVE = this.isCVE(dataRow[row][index]);
    const sortedRows = [...dataRow].sort((rowA, rowB) => {
      // biome-ignore lint/suspicious/noExplicitAny: allowed
      let compare: any;
      const valueA = rowA[index];
      const valueB = rowB[index];
      if (isDate) {
        const dateA = new Date(valueA);
        const dateB = new Date(valueB);
        compare = dateA.getTime() - dateB.getTime();
      } else if (isCVSS) {
        const cvssA = this.getCVSS(valueA);
        const cvssB = this.getCVSS(valueB);
        compare = cvssA - cvssB;
      } else if (isCVE) {
        const [cveYA, cveIA] = this.getCVE(valueA);
        const [cveYB, cveIB] = this.getCVE(valueB);
        compare = cveYA !== cveYB ? cveYA - cveYB : cveIA - cveIB;
      } else {
        compare = valueA.localeCompare(valueB);
      }

      if (sorting === "descending") {
        compare *= -1;
      }
      return compare;
    });
    return [headerRow, ...sortedRows];
  }

  /**
   * To verify the given string is in Date format
   * @param dateString Input date value
   * @returns true if the given input is date
   */
  isValidDate(dateString: string): boolean {
    const validDate = new Date(dateString);
    return !Number.isNaN(validDate.getTime());
  }

  /**
   * To verify the given string is in CVSS format
   * @param cvssString input CVSS value
   * @returns true if the given input is in CVSS format
   */
  isCVSS(cvssString: string): boolean {
    const cvssRegex = /^.+\((\d*\.*\d+?)\)$/;
    return !!cvssRegex.test(cvssString);
  }

  /**
   * To verify the given string is in CVE format
   * @param cve input CVSS value
   * @returns true if the given input is in CVE format
   */
  isCVE(cve: string): boolean {
    const cveRegex = /^CVE-(\d+?)-(\d+?)$/;
    return !!cveRegex.test(cve);
  }

  /**
   * To retrieve CVSS score from the given string
   * @param cvssString input CVSS value
   * @returns CVSS score if the given input is in CVSS format
   */
  getCVSS(cvssString: string): number {
    const cvssRegex = /^.+\((\d*\.*\d+?)\)$/;
    // biome-ignore lint/style/noNonNullAssertion: allowed
    const cvssScore = cvssString.match(cvssRegex)!;
    // biome-ignore lint/style/noNonNullAssertion: allowed
    return parseFloat(cvssScore[1]!);
  }

  /**
   * To retrieve CVE year and ID from the given string
   * @param cve input CVE value
   * @returns CVE Year and ID if the given input is in CVE format
   */
  getCVE(cve: string): [number, number] {
    const matchCVE = cve.match(/^CVE-(\d+)-(\d+)$/);
    if (!matchCVE) throw new Error(`Invalid CVE format: ${cve}`);
    return [Number(matchCVE[1]), Number(matchCVE[2])];
  }

  /**
   * To sort a column for the given order
   * @param columnHeader column Name
   * @param sortOrder Sorting order Ascending or descending
   * @returns Boolean based on whether column sorted with expected order
   */
  async sortColumn(columnHeader: string, sortOrder: string): Promise<boolean> {
    const headerElem = await this._page.getByRole("columnheader", {
      name: `${columnHeader}`,
    });
    for (let i = 0; i < 3; i++) {
      const sort = await headerElem.getAttribute(`aria-sort`);
      if (sort === sortOrder) {
        return true;
      } else {
        await headerElem.getByRole("button").click();
      }
    }
    return false;
  }

  /**
   * Verifies Sorting of given Columns in Ascending and Descending orders
   * @param parentElem ParentElement for Pagination
   * @param columnHeaders List of column headers to be verified
   */
  async verifySorting(
    parentElem: string,
    columnHeaders: string[],
    perPageCount: string = "100",
  ) {
    await this.waitForTableContent();
    await this.selectPerPage(parentElem, perPageCount);
    for (const header of columnHeaders) {
      for (const order of [`ascending`, `descending`]) {
        const sorted = await this.sortColumn(header, order);
        sorted
          ? null
          : (() => {
              throw new Error(
                `Sorting failed for the column ${header} with order ${order}`,
              );
            })();
        const sourceData = await this.getTableRows(parentElem);
        const sortedData = await this.sortTable(
          await sourceData,
          header,
          order,
        );
        await expect(
          sourceData,
          `Column ${header} sorting ${order} order`,
        ).toEqual(sortedData);
      }
    }
  }

  /**
   * To Add given labels to an SBOM from list page
   * @param entity Target SBOM
   * @param labels List of Labels
   */
  async editLabelsListPage(entity: string) {
    await this.waitForTableContent();
    let sbomAction = `xpath=//td[.='${entity}']/parent::tr/td/button`;
    let table = this.getTable();
    await table.locator(sbomAction).click();
    await this._page.getByRole("menuitem", { name: "Edit labels" }).click();
  }

  private getTable() {
    return this._page.locator(`table[aria-label="${this._tableName}"]`);
  }
}
