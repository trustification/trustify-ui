import React from "react";

import { AxiosError } from "axios";

import { WatchedSboms } from "@app/api/models";
import { NotificationsContext } from "@app/components/NotificationsContext";
import {
  useFetchWatchedSboms,
  useUpdateWatchedSbomsMutation,
} from "@app/queries/dashboard";

interface IWatchedSbomsContext {
  sboms?: WatchedSboms;
  isFetching: boolean;
  fetchError: AxiosError | null;

  patch: (key: string, value: string) => void;
}

const contextDefaultValue = {} as IWatchedSbomsContext;

export const WatchedSbomsContext =
  React.createContext<IWatchedSbomsContext>(contextDefaultValue);

interface IWatchedSbomsProvider {
  children: React.ReactNode;
}

export const WatchedSbomsProvider: React.FunctionComponent<
  IWatchedSbomsProvider
> = ({ children }) => {
  const { pushNotification } = React.useContext(NotificationsContext);

  const { sboms, isFetching, fetchError } = useFetchWatchedSboms();

  const onUpdateSuccess = () => {};
  const onUpdateError = (_error: AxiosError) => {
    pushNotification({
      title: "Error while updating the user preferences",
      variant: "danger",
    });
  };

  const { mutate: updateSboms } = useUpdateWatchedSbomsMutation(
    onUpdateSuccess,
    onUpdateError
  );

  const patch = (key: string, value: string) => {
    const newSboms = { ...sboms, [key]: value };
    updateSboms(newSboms as WatchedSboms);
  };

  return (
    <WatchedSbomsContext.Provider
      value={{
        sboms,
        isFetching,
        fetchError,
        patch,
      }}
    >
      {children}
    </WatchedSbomsContext.Provider>
  );
};
