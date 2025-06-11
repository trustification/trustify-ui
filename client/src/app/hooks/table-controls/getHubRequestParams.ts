// Hub filter/sort/pagination utils
// TODO these could use some unit tests!

import type { HubRequestParams, Label } from "@app/api/models";
import {
  type IGetFilterHubRequestParamsArgs,
  getFilterHubRequestParams,
  serializeFilterForHub,
  serializeFilterRequestParamsForHub,
} from "./filtering";
import {
  type IGetPaginationHubRequestParamsArgs,
  getPaginationHubRequestParams,
  serializePaginationRequestParamsForHub,
} from "./pagination";
import {
  type IGetSortHubRequestParamsArgs,
  getSortHubRequestParams,
  serializeSortRequestParamsForHub,
} from "./sorting";

// TODO move this outside this directory as part of decoupling Konveyor-specific code from table-controls.

/**
 * Returns params required to fetch server-filtered/sorted/paginated data from the hub API.
 * - NOTE: This is Konveyor-specific.
 * - Takes "source of truth" state for all table features (returned by useTableControlState),
 * - Call after useTableControlState and before fetching API data and then calling useTableControlProps.
 * - Returns a HubRequestParams object which is structured for easier consumption by other code before the fetch is made.
 * @see useTableControlState
 * @see useTableControlProps
 */
export const getHubRequestParams = <
  TItem,
  TSortableColumnKey extends string,
  TFilterCategoryKey extends string = string,
>(
  args: IGetFilterHubRequestParamsArgs<TItem, TFilterCategoryKey> &
    IGetSortHubRequestParamsArgs<TSortableColumnKey> &
    IGetPaginationHubRequestParamsArgs,
): HubRequestParams => ({
  ...getFilterHubRequestParams(args),
  ...getSortHubRequestParams(args),
  ...getPaginationHubRequestParams(args),
});

/**
 * Converts the HubRequestParams object created above into URLSearchParams (the browser API object for URL query parameters).
 * - NOTE: This is Konveyor-specific.
 * - Used internally by the application's useFetch[Resource] hooks
 */
export const serializeRequestParamsForHub = (
  deserializedParams: HubRequestParams,
): URLSearchParams => {
  const serializedParams = new URLSearchParams();
  serializeFilterRequestParamsForHub(deserializedParams, serializedParams);
  serializeSortRequestParamsForHub(deserializedParams, serializedParams);
  serializePaginationRequestParamsForHub(deserializedParams, serializedParams);
  return serializedParams;
};

interface HubRequestParamsQuery {
  /**
   * The maximum number of entries to return.
   *
   * Zero means: no limit
   */
  limit?: number;
  /**
   * The first item to return, skipping all that come before it.
   *
   * NOTE: The order of items is defined by the API being called.
   */
  offset?: number;
  q?: string;
  sort?: string;
}

/**
 * Like serializeRequestParamsForHub but returns a plain object instead of URLSearchParams.
 */
export const requestParamsQuery = (
  p: HubRequestParams,
): HubRequestParamsQuery => {
  let limit = undefined as number | undefined;
  let offset = undefined as number | undefined;
  if (p.page) {
    limit = p.page.itemsPerPage;
    offset = (p.page.pageNumber - 1) * p.page.itemsPerPage;
  }

  let sort = undefined as string | undefined;
  if (p.sort) {
    sort = `${p.sort.field}:${p.sort.direction}`;
  }

  let q = undefined as string | undefined;
  if (p.filters) {
    q = p.filters
      .filter((f) => {
        const { value } = f;
        return typeof value === "string" || typeof value === "number"
          ? true
          : value.list.length > 0;
      })
      .sort((a, b) => a.field.localeCompare(b.field))
      .map(serializeFilterForHub)
      .join("&");
  }

  return { limit, offset, q, sort };
};

export const labelRequestParamsQuery = (labels: Label[] = []) => {
  return labels
    .map(({ key, value }) => `label:${key}=${value ?? ""}`)
    .join("&");
};
