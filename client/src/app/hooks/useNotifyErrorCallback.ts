import React from "react";

import { NotificationsContext } from "@app/components/NotificationsContext";
import type { AxiosError } from "axios";

// returns an Axios onError callback function that will push a notification with the given message
export const useNotifyErrorCallback = <T>(
  message: string | ((err: AxiosError, payload: T) => string),
) => {
  const { pushNotification } = React.useContext(NotificationsContext);

  return (err: AxiosError, payload: T) => {
    let title = "";
    if (typeof message === "string") {
      title = message;
    } else {
      title = message(err, payload);
    }

    pushNotification({
      title,
      variant: "danger",
    });
  };
};
