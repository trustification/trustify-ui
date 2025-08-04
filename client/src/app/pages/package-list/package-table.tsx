import React from "react";
import { generatePath, NavLink } from "react-router-dom";

import { Table, Tbody, Td, Th, Thead, Tr } from "@patternfly/react-table";

import { PackageQualifiers } from "@app/components/PackageQualifiers";
import { SimplePagination } from "@app/components/SimplePagination";
import {
  ConditionalTableBody,
  TableHeaderContentWithControls,
  TableRowContentWithControls,
} from "@app/components/TableControls";
import { Paths } from "@app/Routes";

import { PackageVulnerabilities } from "./components/PackageVulnerabilities";
import { PackageSearchContext } from "./package-context";

export const PackageTable: React.FC = () => {
  const { isFetching, fetchError, totalItemCount, tableControls } =
    React.useContext(PackageSearchContext);

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
  } = tableControls;

  return (
    <>
      <Table {...tableProps} aria-label="Package table">
        <Thead>
          <Tr>
            <TableHeaderContentWithControls {...tableControls}>
              <Th {...getThProps({ columnKey: "name" })} />
              <Th {...getThProps({ columnKey: "namespace" })} />
              <Th {...getThProps({ columnKey: "version" })} />
              <Th {...getThProps({ columnKey: "type" })} />
              <Th {...getThProps({ columnKey: "path" })} />
              <Th {...getThProps({ columnKey: "qualifiers" })} />
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
            return (
              <Tbody key={item.uuid}>
                <Tr {...getTrProps({ item })}>
                  <TableRowContentWithControls
                    {...tableControls}
                    item={item}
                    rowIndex={rowIndex}
                  >
                    <Td
                      width={15}
                      modifier="breakWord"
                      {...getTdProps({ columnKey: "name" })}
                    >
                      <NavLink
                        to={generatePath(Paths.packageDetails, {
                          packageId: item.uuid,
                        })}
                      >
                        {item.decomposedPurl
                          ? item.decomposedPurl?.name
                          : item.purl}
                      </NavLink>
                    </Td>
                    <Td
                      width={15}
                      modifier="truncate"
                      {...getTdProps({ columnKey: "namespace" })}
                    >
                      {item.decomposedPurl?.namespace}
                    </Td>
                    <Td
                      width={10}
                      modifier="truncate"
                      {...getTdProps({ columnKey: "version" })}
                    >
                      {item.decomposedPurl?.version}
                    </Td>
                    <Td
                      width={10}
                      modifier="truncate"
                      {...getTdProps({ columnKey: "type" })}
                    >
                      {item.decomposedPurl?.type}
                    </Td>
                    <Td
                      width={10}
                      modifier="truncate"
                      {...getTdProps({ columnKey: "path" })}
                    >
                      {item.decomposedPurl?.path}
                    </Td>
                    <Td width={20} {...getTdProps({ columnKey: "qualifiers" })}>
                      {item.decomposedPurl?.qualifiers && (
                        <PackageQualifiers
                          value={item.decomposedPurl?.qualifiers}
                        />
                      )}
                    </Td>
                    <Td
                      width={20}
                      {...getTdProps({ columnKey: "vulnerabilities" })}
                    >
                      <PackageVulnerabilities packageId={item.uuid} />
                    </Td>
                  </TableRowContentWithControls>
                </Tr>
              </Tbody>
            );
          })}
        </ConditionalTableBody>
      </Table>
      <SimplePagination
        idPrefix="package-table"
        isTop={false}
        paginationProps={paginationProps}
      />
    </>
  );
};
