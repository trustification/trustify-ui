import { RequestResult } from "@hey-api/client-axios";

export const dataOf = async <Data, Error>(
  promise: RequestResult<Data, Error>
) => {
  return (await promise).data;
};
