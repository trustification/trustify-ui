import React from "react";

import { useFetchAdvisorySourceById } from "@app/queries/advisories";
import { CodeEditor, Language } from "@patternfly/react-code-editor";

import { LoadingWrapper } from "./LoadingWrapper";

interface AdvisorySourceViewerProps {
  advisoryId: string;
  height?: string | "sizeToFit";
}

export const AdvisorySourceViewer: React.FC<AdvisorySourceViewerProps> = ({
  advisoryId,
  height = "sizeToFit",
}) => {
  const { source, isFetching, fetchError } =
    useFetchAdvisorySourceById(advisoryId);

  const [prettySource, language] = React.useMemo(() => {
    if (!source) {
      return [source, undefined];
    }

    if (typeof source === "object") {
      return [JSON.stringify(source, null, 2), Language.json];
    } else if (typeof source === "string") {
      return [source, Language.plaintext];
    } else {
      return ["Not supported format", Language.plaintext];
    }
  }, [source]);

  return (
    <>
      <LoadingWrapper isFetching={isFetching} fetchError={fetchError}>
        {prettySource && (
          <CodeEditor
            isDarkTheme
            isLineNumbersVisible
            isReadOnly
            isMinimapVisible
            isLanguageLabelVisible
            code={prettySource ?? ""}
            language={language}
            height={height}
          />
        )}
      </LoadingWrapper>
    </>
  );
};
