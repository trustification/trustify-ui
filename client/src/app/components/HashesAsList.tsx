import React from "react";

import { ClipboardCopy, List, ListItem } from "@patternfly/react-core";

interface LabelsAsListProps {
  value: string[];
}

export const HashesAsList: React.FC<LabelsAsListProps> = ({ value }) => {
  return (
    <List isPlain>
      {value.map((item, index) => (
        <ListItem key={index}>
          <ClipboardCopy isReadOnly hoverTip="Copy" clickTip="Copied">
            {item}
          </ClipboardCopy>
        </ListItem>
      ))}
    </List>
  );
};
