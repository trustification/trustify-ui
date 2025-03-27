import React from "react";

export interface TdWithFocusStatusProps {
  children: (
    isFocused: boolean,
    setIsFocused: (value: boolean) => void,
  ) => React.ReactNode;
}

export const TdWithFocusStatus: React.FC<TdWithFocusStatusProps> = ({
  children,
}) => {
  const [isFocused, setIsFocused] = React.useState(false);
  return <>{children(isFocused, setIsFocused)}</>;
};
