import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { HubRequestParams } from "@app/api/models";
import {
  deleteProduct,
  getProduct,
  listProducts,
  ProductDetails,
} from "@app/client";
import { client } from "@app/axios-config/apiInit";
import { convertQuery, dataOf } from "./dataOf";
import { requestParamsQuery } from "../hooks/table-controls";

export const ProductsQueryKey = "products";

export const useFetchProducts = (
  params: HubRequestParams = {},
  refetchDisabled: boolean = false
) => {
  const query = useQuery({
    queryKey: [ProductsQueryKey, params],
    queryFn: () =>
      dataOf(
        listProducts({
          client,
          query: { ...requestParamsQuery(params) },
        })
      ),
    refetchInterval: !refetchDisabled ? 5000 : false,
  });
  return {
    ...convertQuery(query),
    result: {
      data: query.data?.items || [],
      total: query.data?.total ?? 0,
      params: params,
    },
  };
};

export const useFetchProductById = (id: string) => {
  const query = useQuery({
    queryKey: [ProductsQueryKey, id],
    queryFn: () => dataOf(getProduct({ client, path: { id } })),
  });
  return {
    ...convertQuery(query),
    product: query.data,
  };
};

export const useDeleteProductMutation = (
  onError?: (err: AxiosError, id: string) => void,
  onSuccess?: (payload: ProductDetails, id: string) => void
) => {
  return useMutation({
    mutationFn: (id: string) => dataOf(deleteProduct({ client, path: { id } })),
    mutationKey: [ProductsQueryKey],
    onSuccess,
    onError,
  });
};
