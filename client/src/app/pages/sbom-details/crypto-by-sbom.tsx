import React, { useState } from "react";
import { Link } from "react-router-dom";

import {
  Button,
  Card,
  CardBody,
  Content,
  Grid,
  GridItem,
  Tab,
  Tabs,
  TabTitleText,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "@patternfly/react-core";
import { Table, Tbody, Td, Th, Thead, Tr } from "@patternfly/react-table";
import { PolicyLabel } from "@app/components/PolicyLabel";
import { FilterToolbar, FilterType } from "@app/components/FilterToolbar";
import { LoadingWrapper } from "@app/components/LoadingWrapper";
import { PageDrawerContent } from "@app/components/PageDrawerContext";
import { SimplePagination } from "@app/components/SimplePagination";
import {
  ConditionalTableBody,
  TableHeaderContentWithControls,
  TableRowContentWithControls,
} from "@app/components/TableControls";
import { FILTER_TEXT_CATEGORY_KEY } from "@app/Constants";
import {
  getHubRequestParams,
  useTableControlProps,
  useTableControlState,
} from "@app/hooks/table-controls";
import type { CryptoAlgorithm } from "@app/pages/crypto-list/crypto-context";
import { CryptoAlgorithmDetail } from "@app/pages/crypto-list/components/CryptoAlgorithmDetail";
import { useFetchCryptoBySbom } from "@app/queries/crypto";

const algProps = (item: CryptoAlgorithm) =>
  ((item.properties as Record<string, unknown>)?.algorithmProperties as Record<
    string,
    unknown
  >) ?? {};

const rcmProps = (item: CryptoAlgorithm) =>
  ((item.properties as Record<string, unknown>)
    ?.relatedCryptoMaterialProperties as Record<string, unknown>) ?? {};

const getPrimitive = (item: CryptoAlgorithm): string =>
  (algProps(item).primitive as string) ?? "--";

const getKeyType = (item: CryptoAlgorithm): string =>
  (rcmProps(item).type as string) ?? item.asset_type ?? "--";

const getRecommendation = (item: CryptoAlgorithm): string =>
  (algProps(item).recommendation as string) ?? "--";

const getUsage = (item: CryptoAlgorithm): string =>
  (algProps(item).detectionContext as string) ?? "--";

const getOccurrences = (item: CryptoAlgorithm): number =>
  (algProps(item).occurrences as number) ?? 1;

const getPackagesCount = (item: CryptoAlgorithm): number =>
  (algProps(item).packages as number) ?? 0;

const getParameterSet = (item: CryptoAlgorithm): string | undefined =>
  (algProps(item).parameterSetIdentifier as string) ?? undefined;

const formatPercent = (count: number, total: number): string => {
  if (total === 0) return "0%";
  return `${Math.round((count / total) * 100)}%`;
};

interface AssetTableProps {
  sbomId: string;
  onSelectAlgorithm: (item: CryptoAlgorithm) => void;
}

/** Algorithms table with 7 columns matching the main Cryptography page minus SBOMs. */
const AlgorithmsTable: React.FC<AssetTableProps> = ({
  sbomId,
  onSelectAlgorithm,
}) => {
  const tableControlState = useTableControlState({
    tableName: "sbom-crypto-algorithms",
    columnNames: {
      name: "Algorithm name",
      primitive: "Primitive",
      occurrences: "Occurrences",
      policy: "Policy",
      recommendation: "Recommendation",
      usage: "Usage",
      packages: "Packages",
    },
    isPaginationEnabled: true,
    isSortEnabled: true,
    sortableColumns: ["name"],
    initialSort: { columnKey: "name", direction: "asc" },
    isFilterEnabled: true,
    filterCategories: [
      {
        categoryKey: FILTER_TEXT_CATEGORY_KEY,
        title: "Search",
        placeholderText: "Search by algorithm name",
        type: FilterType.search,
      },
    ],
  });

  const {
    result: { data: algorithms, total: totalItemCount },
    isFetching,
    fetchError,
  } = useFetchCryptoBySbom(
    sbomId,
    {
      ...getHubRequestParams({
        ...tableControlState,
        hubSortFieldKeys: { name: "name" },
      }),
      total: true,
    },
    "algorithm",
  );

  const tableControls = useTableControlProps({
    ...tableControlState,
    idProperty: "node_id",
    currentPageItems: algorithms,
    totalItemCount,
    isLoading: isFetching,
    forceNumRenderedColumns: 7,
  });

  const {
    numRenderedColumns,
    currentPageItems,
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
      <Toolbar {...toolbarProps} aria-label="Algorithms toolbar">
        <ToolbarContent>
          <FilterToolbar {...filterToolbarProps} />
          <ToolbarItem {...paginationToolbarItemProps}>
            <SimplePagination
              idPrefix="sbom-crypto-algorithms"
              isTop
              paginationProps={paginationProps}
            />
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>

      <Table {...tableProps} aria-label="Algorithms table">
        <Thead>
          <Tr>
            <TableHeaderContentWithControls {...tableControls}>
              <Th {...getThProps({ columnKey: "name" })} />
              <Th {...getThProps({ columnKey: "primitive" })} />
              <Th {...getThProps({ columnKey: "occurrences" })} />
              <Th {...getThProps({ columnKey: "policy" })} />
              <Th {...getThProps({ columnKey: "recommendation" })} />
              <Th {...getThProps({ columnKey: "usage" })} />
              <Th {...getThProps({ columnKey: "packages" })} />
            </TableHeaderContentWithControls>
          </Tr>
        </Thead>
        <ConditionalTableBody
          isLoading={isFetching}
          isError={!!fetchError}
          isNoData={currentPageItems.length === 0}
          numRenderedColumns={numRenderedColumns}
          noDataEmptyState={
            <Content component="p">No algorithms found for this SBOM.</Content>
          }
        >
          {currentPageItems.map((item, rowIndex) => {
            const parameterSet = getParameterSet(item);
            const packagesCount = getPackagesCount(item);
            return (
              <Tbody key={item.node_id}>
                <Tr {...getTrProps({ item })}>
                  <TableRowContentWithControls
                    {...tableControls}
                    item={item}
                    rowIndex={rowIndex}
                  >
                    <Td
                      width={20}
                      modifier="breakWord"
                      {...getTdProps({ columnKey: "name", item, rowIndex })}
                    >
                      <Button
                        variant="link"
                        isInline
                        onClick={() => onSelectAlgorithm(item)}
                      >
                        {item.name}
                      </Button>
                      {parameterSet && (
                        <Content component="small">
                          Parameter set {parameterSet}
                        </Content>
                      )}
                    </Td>
                    <Td
                      width={10}
                      {...getTdProps({
                        columnKey: "primitive",
                        item,
                        rowIndex,
                      })}
                    >
                      {getPrimitive(item)}
                    </Td>
                    <Td
                      width={10}
                      {...getTdProps({
                        columnKey: "occurrences",
                        item,
                        rowIndex,
                      })}
                    >
                      {getOccurrences(item)}
                    </Td>
                    <Td
                      width={10}
                      {...getTdProps({
                        columnKey: "policy",
                        item,
                        rowIndex,
                      })}
                    >
                      <PolicyLabel policyStatus={item.policy_status} />
                    </Td>
                    <Td
                      width={15}
                      modifier="breakWord"
                      {...getTdProps({
                        columnKey: "recommendation",
                        item,
                        rowIndex,
                      })}
                    >
                      {getRecommendation(item)}
                    </Td>
                    <Td
                      width={10}
                      {...getTdProps({
                        columnKey: "usage",
                        item,
                        rowIndex,
                      })}
                    >
                      {getUsage(item)}
                    </Td>
                    <Td
                      width={10}
                      {...getTdProps({
                        columnKey: "packages",
                        item,
                        rowIndex,
                      })}
                    >
                      <Link
                        to={`/packages?crypto=${encodeURIComponent(item.name)}`}
                      >
                        {packagesCount}{" "}
                        {packagesCount === 1 ? "package" : "packages"}
                      </Link>
                    </Td>
                  </TableRowContentWithControls>
                </Tr>
              </Tbody>
            );
          })}
        </ConditionalTableBody>
      </Table>

      <SimplePagination
        idPrefix="sbom-crypto-algorithms"
        isTop={false}
        paginationProps={paginationProps}
      />
    </>
  );
};

/** Keys table with 4 columns matching the main Cryptography page minus SBOMs. */
const KeysTable: React.FC<AssetTableProps> = ({
  sbomId,
  onSelectAlgorithm,
}) => {
  const tableControlState = useTableControlState({
    tableName: "sbom-crypto-keys",
    columnNames: {
      name: "Name",
      type: "Type",
      occurrences: "Occurrences",
      usage: "Usage",
    },
    isPaginationEnabled: true,
    isSortEnabled: true,
    sortableColumns: ["name"],
    initialSort: { columnKey: "name", direction: "asc" },
    isFilterEnabled: true,
    filterCategories: [
      {
        categoryKey: FILTER_TEXT_CATEGORY_KEY,
        title: "Search",
        placeholderText: "Search",
        type: FilterType.search,
      },
    ],
  });

  const {
    result: { data: keys, total: totalItemCount },
    isFetching,
    fetchError,
  } = useFetchCryptoBySbom(
    sbomId,
    {
      ...getHubRequestParams({
        ...tableControlState,
        hubSortFieldKeys: { name: "name" },
      }),
      total: true,
    },
    "related-crypto-material",
  );

  const tableControls = useTableControlProps({
    ...tableControlState,
    idProperty: "node_id",
    currentPageItems: keys,
    totalItemCount,
    isLoading: isFetching,
    forceNumRenderedColumns: 4,
  });

  const {
    numRenderedColumns,
    currentPageItems,
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
      <Toolbar {...toolbarProps} aria-label="Keys toolbar">
        <ToolbarContent>
          <FilterToolbar {...filterToolbarProps} />
          <ToolbarItem {...paginationToolbarItemProps}>
            <SimplePagination
              idPrefix="sbom-crypto-keys"
              isTop
              paginationProps={paginationProps}
            />
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>

      <Table {...tableProps} aria-label="Keys table">
        <Thead>
          <Tr>
            <TableHeaderContentWithControls {...tableControls}>
              <Th {...getThProps({ columnKey: "name" })} />
              <Th {...getThProps({ columnKey: "type" })} />
              <Th {...getThProps({ columnKey: "occurrences" })} />
              <Th {...getThProps({ columnKey: "usage" })} />
            </TableHeaderContentWithControls>
          </Tr>
        </Thead>
        <ConditionalTableBody
          isLoading={isFetching}
          isError={!!fetchError}
          isNoData={currentPageItems.length === 0}
          numRenderedColumns={numRenderedColumns}
          noDataEmptyState={
            <Content component="p">No keys found for this SBOM.</Content>
          }
        >
          {currentPageItems.map((item, rowIndex) => (
            <Tbody key={item.node_id}>
              <Tr {...getTrProps({ item })}>
                <TableRowContentWithControls
                  {...tableControls}
                  item={item}
                  rowIndex={rowIndex}
                >
                  <Td
                    width={25}
                    modifier="breakWord"
                    {...getTdProps({ columnKey: "name", item, rowIndex })}
                  >
                    <Button
                      variant="link"
                      isInline
                      onClick={() => onSelectAlgorithm(item)}
                    >
                      {item.name}
                    </Button>
                  </Td>
                  <Td
                    width={25}
                    {...getTdProps({ columnKey: "type", item, rowIndex })}
                  >
                    {getKeyType(item)}
                  </Td>
                  <Td
                    width={25}
                    {...getTdProps({
                      columnKey: "occurrences",
                      item,
                      rowIndex,
                    })}
                  >
                    {getOccurrences(item)}
                  </Td>
                  <Td
                    width={25}
                    {...getTdProps({ columnKey: "usage", item, rowIndex })}
                  >
                    {getUsage(item)}
                  </Td>
                </TableRowContentWithControls>
              </Tr>
            </Tbody>
          ))}
        </ConditionalTableBody>
      </Table>

      <SimplePagination
        idPrefix="sbom-crypto-keys"
        isTop={false}
        paginationProps={paginationProps}
      />
    </>
  );
};

interface CryptoBySbomProps {
  sbomId: string;
}

/** Cryptography tab content for the SBOM detail page with KPI cards and algorithm/key sub-tabs. */
export const CryptoBySbom: React.FC<CryptoBySbomProps> = ({ sbomId }) => {
  const [activeTabKey, setActiveTabKey] = useState<string>("algorithms");
  const [selectedAlgorithm, setSelectedAlgorithm] =
    useState<CryptoAlgorithm | null>(null);

  const {
    result: { data: allAlgorithms, total: algorithmsTotal },
    isFetching: isKpiFetching,
    fetchError: kpiFetchError,
  } = useFetchCryptoBySbom(
    sbomId,
    { page: { pageNumber: 1, itemsPerPage: 1000 }, total: true },
    "algorithm",
  );

  const {
    result: { total: keysTotal },
  } = useFetchCryptoBySbom(sbomId, { total: true }, "related-crypto-material");

  const compliantCount = allAlgorithms.filter(
    (a) => a.policy_status === "compliant",
  ).length;
  const classicalCount = allAlgorithms.filter(
    (a) => a.policy_status === "warning",
  ).length;

  return (
    <>
      <LoadingWrapper isFetching={isKpiFetching} fetchError={kpiFetchError}>
        <Grid hasGutter style={{ marginBottom: 16 }}>
          <GridItem md={6}>
            <Card data-testid="kpi-pqc">
              <CardBody>
                <Content component="p">Algorithms meeting PQC</Content>
                <Content component="p">
                  <strong
                    style={{
                      fontSize: "var(--pf-t--global--font--size--2xl)",
                    }}
                  >
                    {formatPercent(compliantCount, algorithmsTotal)}
                  </strong>
                </Content>
                <Content component="small">
                  {compliantCount} of {algorithmsTotal} inventoried algorithms
                  are compliant with the suggested PQC policy
                </Content>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem md={6}>
            <Card data-testid="kpi-classical">
              <CardBody>
                <Content component="p">Classical algorithm share</Content>
                <Content component="p">
                  <strong
                    style={{
                      fontSize: "var(--pf-t--global--font--size--2xl)",
                    }}
                  >
                    {formatPercent(classicalCount, algorithmsTotal)}
                  </strong>
                </Content>
                <Content component="small">
                  {classicalCount} of {algorithmsTotal} algorithms use classical
                  primitives only
                </Content>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </LoadingWrapper>

      <Tabs
        activeKey={activeTabKey}
        onSelect={(_event, tabKey) => setActiveTabKey(String(tabKey))}
      >
        <Tab
          eventKey="algorithms"
          title={<TabTitleText>Algorithms ({algorithmsTotal})</TabTitleText>}
        >
          <AlgorithmsTable
            sbomId={sbomId}
            onSelectAlgorithm={setSelectedAlgorithm}
          />
        </Tab>
        <Tab
          eventKey="keys"
          title={<TabTitleText>Keys ({keysTotal})</TabTitleText>}
        >
          <KeysTable sbomId={sbomId} onSelectAlgorithm={setSelectedAlgorithm} />
        </Tab>
      </Tabs>

      <PageDrawerContent
        isExpanded={selectedAlgorithm !== null}
        onCloseClick={() => setSelectedAlgorithm(null)}
        header={<Content component="h2">{selectedAlgorithm?.name}</Content>}
        pageKey="sbom-crypto-detail"
      >
        {selectedAlgorithm && (
          <CryptoAlgorithmDetail algorithm={selectedAlgorithm} />
        )}
      </PageDrawerContent>
    </>
  );
};
