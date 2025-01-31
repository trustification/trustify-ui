import React from "react";

import { Content } from "@patternfly/react-core";
import ReactMarkdown from "react-markdown";
import spacing from "@patternfly/react-styles/css/utilities/Spacing/spacing";
import { markdownPFComponents } from "./markdownPFComponents";

interface NotesMarkdownProps {
  isCompact?: boolean;
  notes: {
    category: string;
    text: string;
    title: string;
  }[];
}

export const NotesMarkdown: React.FC<NotesMarkdownProps> = ({
  isCompact,
  notes,
}) => {
  return notes.map((e, index) => (
    <Content key={index} className={spacing.mbMd}>
      <Content component={isCompact ? "h4" : "h1"}>
        {e.title} ({e.category.replace("_", " ")})
      </Content>
      <ReactMarkdown components={markdownPFComponents}>{e.text}</ReactMarkdown>
    </Content>
  ));
};
