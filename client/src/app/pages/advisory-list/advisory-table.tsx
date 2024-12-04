import React from "react";
import { NavLink } from "react-router-dom";

import {
  ActionsColumn,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@patternfly/react-table";

import { Severity } from "@app/client";
import { NotificationsContext } from "@app/components/NotificationsContext";
import { SimplePagination } from "@app/components/SimplePagination";
import {
  ConditionalTableBody,
  TableHeaderContentWithControls,
  TableRowContentWithControls,
} from "@app/components/TableControls";
import { useDownload } from "@app/hooks/domain-controls/useDownload";

import { SeverityShieldAndText } from "@app/components/SeverityShieldAndText";
import { VulnerabilityGallery } from "@app/components/VulnerabilityGallery";
import { formatDate } from "@app/utils/utils";

import { AdvisorySearchContext } from "./advisory-context";

export const AdvisoryTable: React.FC = ({}) => {
  const { isFetching, fetchError, totalItemCount, tableControls } =
    React.useContext(AdvisorySearchContext);

  const { pushNotification } = React.useContext(NotificationsContext);

  const {
    numRenderedColumns,
    currentPageItems,
    propHelpers: {
      paginationProps,
      tableProps,
      getThProps,
      getTrProps,
      getTdProps,
    },
    expansionDerivedState: { isCellExpanded },
  } = tableControls;

  const { downloadAdvisory } = useDownload();

  return (
    <>
      <Table {...tableProps} aria-label="advisory-table">
        <Thead>
          <Tr>
            <TableHeaderContentWithControls {...tableControls}>
              <Th {...getThProps({ columnKey: "identifier" })} />
              <Th {...getThProps({ columnKey: "title" })} />
              <Th {...getThProps({ columnKey: "severity" })} />
              <Th {...getThProps({ columnKey: "modified" })} />
              <Th {...getThProps({ columnKey: "vulnerabilities" })} />
            </TableHeaderContentWithControls>
          </Tr>
        </Thead>
        <ConditionalTableBody
          isLoading={isFetching}
          isError={!!fetchError}
          isNoData={totalItemCount === 0}
          numRenderedColumns={numRenderedColumns}
        >
          {currentPageItems.map((item, rowIndex) => {
            type SeverityGroup = { [key in Severity]: number };
            const defaultSeverityGroup: SeverityGroup = {
              critical: 0,
              high: 0,
              medium: 0,
              low: 0,
              none: 0,
            };

            const severiries = item.vulnerabilities.reduce((prev, current) => {
              return {
                ...prev,
                [current.severity]: prev[current.severity] + 1,
              };
            }, defaultSeverityGroup);

            return (
              <Tbody key={item.identifier} isExpanded={isCellExpanded(item)}>
                <Tr {...getTrProps({ item })}>
                  <TableRowContentWithControls
                    {...tableControls}
                    item={item}
                    rowIndex={rowIndex}
                  >
                    <Td
                      width={15}
                      {...getTdProps({
                        columnKey: "identifier",
                        isCompoundExpandToggle: true,
                        item: item,
                        rowIndex,
                      })}
                    >
                      <NavLink to={`/advisories/${item.uuid}`}>
                        {item.document_id}
                      </NavLink>
                    </Td>
                    <Td
                      width={40}
                      modifier="truncate"
                      {...getTdProps({ columnKey: "title" })}
                    >
                      {item.title}
                    </Td>
                    <Td
                      width={15}
                      modifier="truncate"
                      {...getTdProps({ columnKey: "severity" })}
                    >
                      {item.average_severity && (
                        <SeverityShieldAndText
                          value={item.average_severity as Severity}
                        />
                      )}
                    </Td>
                    <Td width={10} {...getTdProps({ columnKey: "modified" })}>
                      {formatDate(item.modified)}
                    </Td>
                    <Td
                      width={20}
                      {...getTdProps({ columnKey: "vulnerabilities" })}
                    >
                      <VulnerabilityGallery severities={severiries} />
                    </Td>
                    <Td isActionCell>
                      <ActionsColumn
                        items={[
                          {
                            title: "Download",
                            onClick: () => {
                              downloadAdvisory(
                                item.uuid,
                                `${item.identifier}.json`
                              );
                            },
                          },
                        ]}
                      />
                    </Td>
                  </TableRowContentWithControls>
                </Tr>
              </Tbody>
            );
          })}
        </ConditionalTableBody>
      </Table>
      <SimplePagination
        idPrefix="advisory-table"
        isTop={false}
        isCompact
        paginationProps={paginationProps}
      />
    </>
  );
};
