import React from "react";
import { NavLink } from "react-router-dom";

import dayjs from "dayjs";

import { Toolbar, ToolbarContent, ToolbarItem } from "@patternfly/react-core";
import { Table, Tbody, Td, Th, Thead, Tr } from "@patternfly/react-table";

import { client } from "@app/axios-config/apiInit";
import { getSbom, ProductDetails, SbomSummary } from "@app/client";
import { FilterToolbar, FilterType } from "@app/components/FilterToolbar";
import { LabelsAsList } from "@app/components/LabelsAsList";
import { SimplePagination } from "@app/components/SimplePagination";
import {
  ConditionalTableBody,
  TableHeaderContentWithControls,
} from "@app/components/TableControls";
import { useLocalTableControls } from "@app/hooks/table-controls";
import { formatDate } from "@app/utils/utils";

interface TableData {
  sbomId: string;
  sbomVersion: string;
  sbom?: SbomSummary;
}

interface ProductVersionsProps {
  product: ProductDetails;
}

export const ProductVersions: React.FC<ProductVersionsProps> = ({
  product,
}) => {
  const [allSbombs, setAllSboms] = React.useState<TableData[]>([]);
  const [sbomsById, setSbomsById] = React.useState<Map<string, SbomSummary>>(
    new Map()
  );
  const [isFetchingSboms, setIsFetchingSboms] = React.useState(false);

  React.useEffect(() => {
    const sbombs: TableData[] = (product?.versions ?? []).flatMap((sbom) => {
      return {
        sbomId: sbom.sbom_id,
        sbomVersion: sbom.version,
      } as TableData;
    });

    setAllSboms(sbombs);
    setIsFetchingSboms(true);

    Promise.all(
      sbombs
        .map((item) => {
          return getSbom({ client, path: { id: item.sbomId } }).then(
            (response) => response.data
          );
        })
        .map((sbom) => sbom.catch(() => null))
    ).then((sboms) => {
      const validSboms = sboms.reduce((prev, current) => {
        if (current) {
          return [...prev, current];
        } else {
          // Filter out error responses
          return prev;
        }
      }, [] as SbomSummary[]);

      const sbomsById = new Map<string, SbomSummary>();
      validSboms.forEach((sbom) => sbomsById.set(sbom.id, sbom));

      setSbomsById(sbomsById);
      setIsFetchingSboms(false);
    });
  }, [product]);

  const tableData = React.useMemo(() => {
    return allSbombs.map((item) => {
      const result: TableData = {
        ...item,
        sbom: sbomsById.get(item.sbomId),
      };
      return result;
    });
  }, [allSbombs, sbomsById]);

  const tableControls = useLocalTableControls({
    tableName: "version-table",
    idProperty: "sbomId",
    items: tableData,
    isLoading: false,
    columnNames: {
      name: "Name",
      published: "Published",
      labels: "Labels",
      version: "Version",
    },
    isSortEnabled: true,
    sortableColumns: ["published"],
    getSortValues: (item) => ({
      published: item.sbom?.published
        ? dayjs(item.sbom.published).valueOf()
        : 0,
    }),
    isPaginationEnabled: true,
    isFilterEnabled: true,
    filterCategories: [
      {
        categoryKey: "filterText",
        title: "Filter tex",
        type: FilterType.search,
        placeholderText: "Search...",
        getItemValue: (item) => item.sbomVersion,
      },
    ],
    isExpansionEnabled: false,
  });

  const {
    currentPageItems,
    numRenderedColumns,
    propHelpers: {
      toolbarProps,
      filterToolbarProps,
      paginationToolbarItemProps,
      paginationProps,
      tableProps,
      getThProps,
      getTrProps,
      getTdProps,
    },
  } = tableControls;

  return (
    <>
      <Toolbar {...toolbarProps}>
        <ToolbarContent>
          <FilterToolbar showFiltersSideBySide {...filterToolbarProps} />
          <ToolbarItem {...paginationToolbarItemProps}>
            <SimplePagination
              idPrefix="version-table"
              isTop
              paginationProps={paginationProps}
            />
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>

      <Table
        {...tableProps}
        aria-label="Version table"
        className="vertical-middle-aligned-table"
      >
        <Thead>
          <Tr>
            <TableHeaderContentWithControls {...tableControls}>
              <Th {...getThProps({ columnKey: "name" })} />
              <Th {...getThProps({ columnKey: "published" })} />
              <Th {...getThProps({ columnKey: "labels" })} />
              <Th {...getThProps({ columnKey: "version" })} />
            </TableHeaderContentWithControls>
          </Tr>
        </Thead>
        <ConditionalTableBody
          isLoading={isFetchingSboms}
          isError={undefined}
          isNoData={tableData.length === 0}
          numRenderedColumns={numRenderedColumns}
        >
          {currentPageItems?.map((item, rowIndex) => {
            return (
              <Tbody key={item.sbomId}>
                <Tr {...getTrProps({ item })}>
                  <Td
                    width={15}
                    modifier="truncate"
                    {...getTdProps({ columnKey: "name" })}
                  >
                    <NavLink to={`/sboms/${item.sbomId}`}>
                      {item.sbom?.name}
                    </NavLink>
                  </Td>
                  <Td
                    width={10}
                    modifier="truncate"
                    {...getTdProps({ columnKey: "published" })}
                  >
                    {formatDate(item.sbom?.published)}
                  </Td>
                  <Td
                    width={10}
                    modifier="truncate"
                    {...getTdProps({ columnKey: "labels" })}
                  >
                    {item.sbom?.labels && (
                      <LabelsAsList value={item.sbom?.labels} />
                    )}
                  </Td>
                  <Td
                    width={10}
                    modifier="truncate"
                    {...getTdProps({ columnKey: "version" })}
                  >
                    {item.sbomVersion}
                  </Td>
                </Tr>
              </Tbody>
            );
          })}
        </ConditionalTableBody>
      </Table>
      <SimplePagination
        idPrefix="version-table"
        isTop={false}
        isCompact
        paginationProps={paginationProps}
      />
    </>
  );
};
