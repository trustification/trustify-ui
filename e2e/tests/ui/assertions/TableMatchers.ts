import { expect as baseExpect } from "@playwright/test";
import type { Table } from "../pages/Table";
import type { MatcherResult } from "./types";

export interface TableMatchers<
  TColumns extends readonly string[],
  _TActions extends readonly string[],
> {
  toBeSortedBy(
    columnName: TColumns[number],
    order: "ascending" | "descending",
  ): Promise<MatcherResult>;
  toHaveColumnWithValue(
    columnName: TColumns[number],
    value: string | RegExp,
    rowIndex?: number | "all",
  ): Promise<MatcherResult>;
  toHaveNumberOfRows(expectedRows: {
    equal?: number;
    greaterThan?: number;
    lessThan?: number;
  }): Promise<MatcherResult>;
  toHaveColumnHeader(columnName: TColumns[number]): Promise<MatcherResult>;
  toHaveEmptyState(): Promise<MatcherResult>;
  toHaveCvssCellContent(
    rowFilter: Partial<Record<TColumns[number], string>>,
    cvssAssertions: {
      severity?: string;
      score?: string;
      version?: string;
      noVersionTag?: boolean;
    },
  ): Promise<MatcherResult>;
}

type TableMatcherDefinitions = {
  readonly [K in keyof TableMatchers<readonly string[], readonly string[]>]: <
    const TColumns extends readonly string[],
    const TActions extends readonly string[],
  >(
    receiver: Table<TColumns, TActions>,
    ...args: Parameters<TableMatchers<TColumns, TActions>[K]>
  ) => Promise<MatcherResult>;
};

export const tableAssertions = baseExpect.extend<TableMatcherDefinitions>({
  toBeSortedBy: async <
    const TColumns extends readonly string[],
    const TActions extends readonly string[],
  >(
    table: Table<TColumns, TActions>,
    columnName: TColumns[number],
    order: "ascending" | "descending",
  ) => {
    try {
      const columnHeader = await table.getColumnHeader(columnName);
      await baseExpect(columnHeader).toHaveAttribute("aria-sort", order);

      return {
        pass: true,
        message: () => `Table is sorted by ${columnName} in ${order} order`,
      };
    } catch (error) {
      return {
        pass: false,
        message: () => (error instanceof Error ? error.message : String(error)),
      };
    }
  },
  toHaveColumnWithValue: async <
    const TColumns extends readonly string[],
    const TActions extends readonly string[],
  >(
    table: Table<TColumns, TActions>,
    columnName: TColumns[number],
    value: string | RegExp,
    rowIndex?: number | "all",
  ) => {
    try {
      if (rowIndex === undefined) {
        await baseExpect(
          table._table
            .locator(`td[data-label="${columnName}"]`, {
              hasText: value,
            })
            .first(),
        ).toBeVisible();
      } else if (rowIndex === "all") {
        const rows = table._table.locator(
          `td[data-label="${table._columns[0]}"]`,
        );
        await baseExpect.poll(() => rows.count()).toBeGreaterThan(0);

        // Verify all rows in the specified column contain the expected value
        const column = await table.getColumn(columnName);
        const allRows = await column.all();

        for (const row of allRows) {
          await baseExpect(row).toContainText(value);
        }
      } else {
        await baseExpect(
          table._table.locator(`td[data-label="${columnName}"]`).nth(rowIndex),
        ).toContainText(value);
      }

      return {
        pass: true,
        message: () => {
          if (rowIndex === undefined) {
            return `Column "${columnName}" contains value "${value}"`;
          } else if (rowIndex === "all") {
            return `All rows in column "${columnName}" contain value "${value}"`;
          } else {
            return `Row ${rowIndex} contains "${value}" in column "${columnName}"`;
          }
        },
      };
    } catch (error) {
      return {
        pass: false,
        message: () => (error instanceof Error ? error.message : String(error)),
      };
    }
  },
  toHaveNumberOfRows: async <
    const TColumns extends readonly string[],
    const TActions extends readonly string[],
  >(
    table: Table<TColumns, TActions>,
    expectedRows: { equal?: number; greaterThan?: number; lessThan?: number },
  ) => {
    try {
      const rows = table._table.locator(
        `td[data-label="${table._columns[0]}"]`,
      );

      if (expectedRows.equal) {
        await baseExpect.poll(() => rows.count()).toBe(expectedRows.equal);
      }
      if (expectedRows.greaterThan) {
        await baseExpect
          .poll(() => rows.count())
          .toBeGreaterThan(expectedRows.greaterThan);
      }
      if (expectedRows.lessThan) {
        await baseExpect
          .poll(() => rows.count())
          .toBeLessThan(expectedRows.lessThan);
      }

      return {
        pass: true,
        message: () => "Table contains expected rows",
      };
    } catch (error) {
      return {
        pass: false,
        message: () => (error instanceof Error ? error.message : String(error)),
      };
    }
  },
  toHaveColumnHeader: async <
    const TColumns extends readonly string[],
    const TActions extends readonly string[],
  >(
    table: Table<TColumns, TActions>,
    columnName: TColumns[number],
  ) => {
    try {
      const columnHeader = table._table.getByRole("columnheader", {
        name: new RegExp(columnName),
      });
      await baseExpect(columnHeader.first()).toBeVisible();

      return {
        pass: true,
        message: () => `Column header "${columnName}" is visible`,
      };
    } catch (error) {
      return {
        pass: false,
        message: () => (error instanceof Error ? error.message : String(error)),
      };
    }
  },
  toHaveEmptyState: async <
    const TColumns extends readonly string[],
    const TActions extends readonly string[],
  >(
    table: Table<TColumns, TActions>,
  ): Promise<MatcherResult> => {
    try {
      await baseExpect(
        table._table.locator(`tbody[aria-label="Table empty"]`),
      ).toBeVisible();

      return {
        pass: true,
        message: () => "Table has empty state",
      };
    } catch (error) {
      return {
        pass: false,
        message: () => (error instanceof Error ? error.message : String(error)),
      };
    }
  },
  toHaveCvssCellContent: async <
    const TColumns extends readonly string[],
    const TActions extends readonly string[],
  >(
    table: Table<TColumns, TActions>,
    rowFilter: Partial<Record<TColumns[number], string>>,
    cvssAssertions: {
      severity?: string;
      score?: string;
      version?: string;
      noVersionTag?: boolean;
    },
  ) => {
    try {
      const row = await table.getRowsByCellValue(rowFilter);
      const cvssCell = row.locator('td[data-label="CVSS"]').first();

      if (cvssAssertions.severity) {
        await baseExpect(
          cvssCell.getByText(cvssAssertions.severity, { exact: true }),
        ).toBeVisible();
      }
      if (cvssAssertions.score) {
        await baseExpect(
          cvssCell.getByText(`(${cvssAssertions.score})`),
        ).toBeVisible();
      }
      if (cvssAssertions.version) {
        await baseExpect(
          cvssCell.getByText(cvssAssertions.version, { exact: true }),
        ).toBeVisible();
      }
      if (cvssAssertions.noVersionTag) {
        await baseExpect(cvssCell.getByText(/^v\d/)).toHaveCount(0);
      }

      return {
        pass: true,
        message: () =>
          `CVSS cell matches expected content: ${JSON.stringify(cvssAssertions)}`,
      };
    } catch (error) {
      return {
        pass: false,
        message: () => (error instanceof Error ? error.message : String(error)),
      };
    }
  },
});
