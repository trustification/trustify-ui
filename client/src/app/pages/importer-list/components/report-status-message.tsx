import React from "react";

import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "@patternfly/react-core";
import { LogViewer, LogViewerSearch } from "@patternfly/react-log-viewer";

import { ANSICOLOR } from "@app/Constants";
import type { Message } from "@app/client";

const messagesToLogData = (messages: {
  [key: string]: {
    [key: string]: Array<Message>;
  };
}) => {
  return Object.entries(messages).map(([groupKey, value]) => {
    return Object.entries(value)
      .map(([objectKey, objectValue]) => {
        return {
          title: `${groupKey.charAt(0).toUpperCase() + groupKey.slice(1)}: "${objectKey}"`,
          body: objectValue
            .map((item) => {
              let color: string | null = null;
              switch (item.severity) {
                case "none":
                  color = ANSICOLOR.green;
                  break;
                case "low":
                  color = ANSICOLOR.cyan;
                  break;
                case "medium":
                  color = ANSICOLOR.yellow;
                  break;
                case "high":
                  color = ANSICOLOR.lightBlue;
                  break;
                case "critical":
                  color = ANSICOLOR.red;
                  break;
                default:
                  break;
              }
              return `${color ?? ""}${item.severity.charAt(0).toUpperCase() + item.severity.slice(1)}: ${ANSICOLOR.defaultForegroundColorAtStartup} ${item.message}`;
            })
            .join(ANSICOLOR.endLine),
        };
      })
      .map((item) => {
        return `${ANSICOLOR.underline}${item.title}${ANSICOLOR.reset}${ANSICOLOR.endLine}${item.body}`;
      })
      .join(`${ANSICOLOR.endLine}${ANSICOLOR.endLine}`);
  });
};

interface IReportStatusMessageProps {
  description?: string;
  messages: {
    [key: string]: {
      [key: string]: Message[];
    };
  } | null;
  children: (childProps: { toggleLogModal: () => void }) => React.ReactNode;
}

export const ReportStatusMessage: React.FC<IReportStatusMessageProps> = ({
  description,
  messages,
  children,
}) => {
  const [isLogModalOpen, setIsLogModalOpen] = React.useState(false);
  const toggleLogModal = () => setIsLogModalOpen(!isLogModalOpen);

  const logData = React.useMemo(() => {
    return messagesToLogData(messages ?? {});
  }, [messages]);

  return (
    <>
      {children({ toggleLogModal })}

      <Modal variant="large" isOpen={isLogModalOpen} onClose={toggleLogModal}>
        <ModalHeader title="Log" description={description} />
        <ModalBody>
          <LogViewer
            hasLineNumbers={false}
            height={400}
            data={logData}
            theme="dark"
            toolbar={
              <Toolbar>
                <ToolbarContent>
                  <ToolbarItem>
                    <LogViewerSearch
                      placeholder="Search value"
                      minSearchChars={1}
                    />
                  </ToolbarItem>
                </ToolbarContent>
              </Toolbar>
            }
          />
        </ModalBody>
        <ModalFooter>
          <Button key="cancel" variant="link" onClick={toggleLogModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};
