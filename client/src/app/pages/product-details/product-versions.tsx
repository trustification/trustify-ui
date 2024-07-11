import React from "react";

import { Toolbar, ToolbarContent, ToolbarItem } from "@patternfly/react-core";
import { Table, Tbody, Td, Th, Thead, Tr } from "@patternfly/react-table";

import { Product, SBOM } from "@app/api/models";
import { getSBOMById } from "@app/api/rest";
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
  sbom?: SBOM;
}

interface ProductVersionsProps {
  product: Product;
}

export const ProductVersions: React.FC<ProductVersionsProps> = ({
  product,
}) => {
  const [allSbombs, setAllSboms] = React.useState<TableData[]>([]);
  const [sbomsById, setSbomsById] = React.useState<Map<string, SBOM>>(
    new Map()
  );
  const [isFetchingSboms, setIsFetchingSboms] = React.useState(false);

  React.useEffect(() => {
    const sbombs: TableData[] = (product?.versions ?? []).flatMap((sbom) => {
      return {
        // TODO should remove hardcoded prefix after https://github.com/trustification/trustify/pull/539
        sbomId: `urn:uuid:${sbom.sbom_id}`,
        sbomVersion: sbom.version,
      };
    });

    setAllSboms(sbombs);
    setIsFetchingSboms(true);

    Promise.all(
      sbombs
        .map((item) => getSBOMById(item.sbomId))
        .map((sbom) => sbom.catch(() => null))
    ).then((sboms) => {
      const validSboms = sboms.reduce((prev, current) => {
        if (current) {
          return [...prev, current];
        } else {
          // Filter out error responses
          return prev;
        }
      }, [] as SBOM[]);

      const sbomsById = new Map<string, SBOM>();
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
    sortableColumns: [],
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

      <Table {...tableProps} aria-label="Version table">
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
                    {item.sbom?.name}
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
