import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import {
  Bullseye,
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Title,
} from "@patternfly/react-core";
import UserNinjaIcon from "@patternfly/react-icons/dist/esm/icons/user-ninja-icon";
import spacing from "@patternfly/react-styles/css/utilities/Spacing/spacing";

import { NotificationsContext } from "@app/components/NotificationsContext";

const usePrevious = <T,>(value: T) => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};

export const ErrorFallback = ({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: (...args: Array<unknown>) => void;
}) => {
  const navigate = useNavigate();
  const { pushNotification } = React.useContext(NotificationsContext);
  const prevError = usePrevious(error);

  if (error.message !== prevError?.message) {
    pushNotification({
      title: "Failed",
      message: error.message,
      variant: "danger",
      timeout: 30000,
    });
  }

  return (
    <Bullseye>
      <EmptyState variant={EmptyStateVariant.sm}>
        <EmptyStateIcon icon={UserNinjaIcon} />
        <Title headingLevel="h2" size="lg">
          Oops! Something went wrong.
        </Title>
        <EmptyStateBody>
          Try to refresh your page or contact your admin.
          <Button
            variant="primary"
            className={spacing.mtSm}
            onClick={() => {
              navigate("/");
              resetErrorBoundary(false);
            }}
          >
            Refresh
          </Button>
        </EmptyStateBody>
      </EmptyState>
    </Bullseye>
  );
};
