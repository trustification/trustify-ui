import type { HubRequestParams } from "@app/api/models";
import type { IPaginationState } from "./usePaginationState";

/**
 * Args for getPaginationHubRequestParams
 * - Partially satisfied by the object returned by useTableControlState (ITableControlState)
 */
export interface IGetPaginationHubRequestParamsArgs {
  /**
   * The "source of truth" state for the pagination feature (returned by usePaginationState)
   */
  paginationState?: IPaginationState;
}

/**
 * Given the state for the pagination feature and additional arguments, returns params the hub API needs to apply the current pagination.
 * - Makes up part of the object returned by getHubRequestParams
 * @see getHubRequestParams
 */
export const getPaginationHubRequestParams = ({
  paginationState,
}: IGetPaginationHubRequestParamsArgs): Partial<HubRequestParams> => {
  if (!paginationState) return {};
  const { pageNumber, itemsPerPage } = paginationState;
  return { page: { pageNumber, itemsPerPage } };
};
