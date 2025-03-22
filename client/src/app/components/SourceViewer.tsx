import React from "react";

import type { AxiosError } from "axios";

import { useFetchAdvisorySourceById } from "@app/queries/advisories";
import { CodeEditor, Language } from "@patternfly/react-code-editor";

import { useFetchSBOMSourceById } from "@app/queries/sboms";

import { LoadingWrapper } from "./LoadingWrapper";

interface SourceViewerProps {
  source?: object | string;
  isFetching: boolean;
  fetchError: AxiosError;
  height?: string | "sizeToFit";
}

export const SourceViewer: React.FC<SourceViewerProps> = ({
  source,
  isFetching,
  fetchError,
  height = "sizeToFit",
}) => {
  const [prettySource, language] = React.useMemo(() => {
    if (!source) {
      return [source, undefined];
    }

    if (typeof source === "object") {
      return [JSON.stringify(source, null, 2), Language.json];
    }
    if (typeof source === "string") {
      return [source, Language.plaintext];
    }
    return ["Not supported format", Language.plaintext];
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

  return (
    <>
      <SourceViewer
        source={source}
        isFetching={isFetching}
        fetchError={fetchError}
        height={height}
      />
    </>
  );
};

interface SbomSourceViewerProps {
  sbomId: string;
  height?: string | "sizeToFit";
}

export const SbomSourceViewer: React.FC<SbomSourceViewerProps> = ({
  sbomId,
  height = "sizeToFit",
}) => {
  const { source, isFetching, fetchError } = useFetchSBOMSourceById(sbomId);

  return (
    <>
      <SourceViewer
        source={source}
        isFetching={isFetching}
        fetchError={fetchError}
        height={height}
      />
    </>
  );
};
