import React from "react";
import { NavLink } from "react-router-dom";

import dayjs from "dayjs";

import { Toolbar, ToolbarContent, ToolbarItem } from "@patternfly/react-core";
import {
  ActionsColumn,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@patternfly/react-table";

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
import { SbomVulnerabilityShields } from "@app/components/SbomVulnerabilityShields";
import { VulnerabilityGallery } from "@app/components/VulnerabilityGallery";

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
        sbomId: sbom.sbom_id,
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
      version: "Version",
      published: "Published",
      vulnerabilities: "Vulnerabilities",
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
        placeholderText: "Search by version...",
        getItemValue: (item) => item.sbomVersion,
      },
    ],
    isExpansionEnabled: false,
    hasActionsColumn: true,
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
              <Th {...getThProps({ columnKey: "version" })} />
              <Th {...getThProps({ columnKey: "published" })} />
              <Th {...getThProps({ columnKey: "vulnerabilities" })} />
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
                    width={20}
                    modifier="truncate"
                    {...getTdProps({ columnKey: "version" })}
                  >
                    <NavLink to={`/sboms/${item.sbomId}`}>
                      {item.sbomVersion}
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
                    {...getTdProps({ columnKey: "vulnerabilities" })}
                  >
                    {/* {item.sbom && <SbomVulnerabilityShields sbom={item.sbom} />} */}
                    <VulnerabilityGallery
                        severities={{
                          critical: Math.floor(Math.random() * 10),
                          high: Math.floor(Math.random() * 10),
                          medium: Math.floor(Math.random() * 10),
                          low: Math.floor(Math.random() * 10),
                          none: Math.floor(Math.random() * 10),
                        }}
                      />
                  </Td>
                  <Td isActionCell>
                    <ActionsColumn
                      items={[
                        {
                          title: "Download",
                          onClick: () => {},
                        },
                        {
                          title: "Delete",
                          onClick: () => {},
                        },
                      ]}
                    />
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
