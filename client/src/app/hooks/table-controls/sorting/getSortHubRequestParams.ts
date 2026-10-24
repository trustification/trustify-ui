import type { HubRequestParams } from "@app/api/models";
import type { ISortState } from "./useSortState";

/**
 * Args for getSortHubRequestParams
 * - Partially satisfied by the object returned by useTableControlState (ITableControlState)
 */
export interface IGetSortHubRequestParamsArgs<
  TSortableColumnKey extends string,
> {
  /**
   * The "source of truth" state for the sort feature (returned by usePaginationState)
   */
  sortState?: ISortState<TSortableColumnKey>;
  /**
   * A map of `columnKey` values (keys of the `columnNames` object passed to useTableControlState) to the field keys used by the hub API for sorting on those columns
   * - Keys and values in this object will usually be the same, but sometimes we need to present a hub field with a different name/key or have a column that is a composite of multiple hub fields.
   */
  hubSortFieldKeys?: Record<TSortableColumnKey, string>;
}

/**
 * Given the state for the sort feature and additional arguments, returns params the hub API needs to apply the current sort.
 * - Makes up part of the object returned by getHubRequestParams
 * @see getHubRequestParams
 */
export const getSortHubRequestParams = <TSortableColumnKey extends string>({
  sortState,
  hubSortFieldKeys,
}: IGetSortHubRequestParamsArgs<TSortableColumnKey>): Partial<HubRequestParams> => {
  if (!sortState?.activeSort || !hubSortFieldKeys) return {};
  const { activeSort } = sortState;
  return {
    sort: {
      field: hubSortFieldKeys[activeSort.columnKey],
      direction: activeSort.direction,
    },
  };
};
