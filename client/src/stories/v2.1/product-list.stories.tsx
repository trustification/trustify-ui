import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import CodeBranchIcon from "@patternfly/react-icons/dist/esm/icons/code-branch-icon";
import {
  BellIcon,
  CubeIcon,
  HelpIcon,
  ThumbtackIcon,
} from "@patternfly/react-icons";
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  ExpandableRowContent,
  TdProps,
  IAction,
  ActionsColumn,
  ThProps,
} from "@patternfly/react-table";
import spacing from "@patternfly/react-styles/css/utilities/Spacing/spacing";
import {
  Badge,
  Button,
  Form,
  FormGroup,
  FormSelect,
  FormSelectOption,
  Icon,
  Modal,
  ModalVariant,
  Popover,
  TextInput,
} from "@patternfly/react-core";
import { SBOMVulnerabilities } from "@app/pages/sbom-list/components/SbomVulnerabilities";
import formStyles from "@patternfly/react-styles/css/components/Form/form";
import { SeverityShieldAndText } from "@app/components/SeverityShieldAndText";

// DATA IMPORTS

import cve_202245787 from "@mocks/data/vulnerability/CVE-2022-45787/details.json";
import cve_20230044 from "@mocks/data/vulnerability/CVE-2023-0044/details.json";
import cve_20230481 from "@mocks/data/vulnerability/CVE-2023-0481/details.json";
import cve_20230482 from "@mocks/data/vulnerability/CVE-2023-0482/details.json";
import cve_20231370 from "@mocks/data/vulnerability/CVE-2023-1370/details.json";
import cve_20231436 from "@mocks/data/vulnerability/CVE-2023-1436/details.json";
import cve_202320861 from "@mocks/data/vulnerability/CVE-2023-20861/details.json";
import cve_202324815 from "@mocks/data/vulnerability/CVE-2023-24815/details.json";
import cve_202324998 from "@mocks/data/vulnerability/CVE-2023-24998/details.json";
import cve_202326464 from "@mocks/data/vulnerability/CVE-2023-26464/details.json";

import advisory_03bb16dc from "@mocks/data/advisory/details/03bb16dc-3cff-4a7d-8393-9a6a7124ecc2.json";
import advisory_87aa81c3 from "@mocks/data/advisory/details/87aa81c3-2aa5-438e-b5d4-d67ca4e321a9.json";
import advisory_88a4fc6c from "@mocks/data/advisory/details/88a4fc6c-60ae-4e4a-bdbe-4fb2e1d33e9c.json";
import advisory_459c504b from "@mocks/data/advisory/details/459c504b-7e09-4ea9-9cbb-baa8ce040e83.json";
import advisory_671dd85b from "@mocks/data/advisory/details/671dd85b-409f-4509-9a50-c4b2404ac10a.json";
import advisory_673acfc8 from "@mocks/data/advisory/details/673acfc8-ea7d-4c6d-aff9-20cf70caade0.json";
import advisory_32600b15 from "@mocks/data/advisory/details/32600b15-f2c1-4115-bcfb-0d0e1786f86d.json";
import advisory_d99d1421 from "@mocks/data/advisory/details/d99d1421-e2fd-49c2-b2dd-82fe848fff48.json";
import advisory_ea257645 from "@mocks/data/advisory/details/ea257645-f52f-4723-9c73-a4ed589f67ac.json";
import advisory_ee8cff4d from "@mocks/data/advisory/details/ee8cff4d-d6bc-4a27-89ac-a7ad193f5eb6.json";

interface IProduct {
  id: string;
  name: string;
  components?: number;
  currentVersion?: string;
  description?: string;
  labels?: string[];
  policyViolations?: number;
  sbomId: string;
  tags?: any[];
  advisories?: any[];
  vulnerabilities?: any[];
}

const ProductList: React.FC<{ products: IProduct[] }> = ({ products }) => {
  const columnNames = {
    name: "Products",
    currentVersion: "Current Version",
    policyViolations: "Policy Violations",
    advisories: "Advisories",
    vulnerabilities: "Vulnerabilities",
  };

  type ColumnKey = keyof typeof columnNames;

  const [isAlertModalOpen, setAlertModalOpen] = React.useState(false);
  const [alertNameValue, setAlertNameValue] = React.useState("");
  const [alertOption, setAlertOption] = React.useState("please choose");

  const [expandedCells, setExpandedCells] = React.useState<
    Record<string, ColumnKey>
  >({
    "RH Trusted Artifact Signer": "currentVersion",
  });
  const [activeSortIndex, setActiveSortIndex] = React.useState<number | null>(
    null
  );
  const [activeSortDirection, setActiveSortDirection] = React.useState<
    "asc" | "desc" | null
  >(null);
  const [favoriteProductNames, setFavoriteProductNames] = React.useState<
    string[]
  >([]);

  const setCellExpanded = (
    product: IProduct,
    columnKey: ColumnKey,
    isExpanding = true
  ) => {
    const newExpandedCells = { ...expandedCells };
    if (isExpanding) {
      newExpandedCells[product.name] = columnKey;
    } else {
      delete newExpandedCells[product.name];
    }
    setExpandedCells(newExpandedCells);
  };

  const compoundExpandParams = (
    product: IProduct,
    columnKey: ColumnKey,
    rowIndex: number,
    columnIndex: number
  ): TdProps["compoundExpand"] => ({
    isExpanded: expandedCells[product.name] === columnKey,
    onToggle: () =>
      setCellExpanded(
        product,
        columnKey,
        expandedCells[product.name] !== columnKey
      ),
    expandId: "compound-expand",
    rowIndex,
    columnIndex,
  });

  const defaultActions = (product: IProduct): IAction[] => [
    {
      title: "Edit",
      onClick: () =>
        console.log(`clicked on Edit action, on row ${product.name}`),
    },
    {
      title: <a href="#">View SBOM</a>,
    },
    {
      isSeparator: true,
    },
    {
      title: "Delete",
      onClick: () =>
        console.log(`clicked on Delete action, on row ${product.name}`),
    },
  ];

  const setProductFavorited = (product: IProduct, isFavoriting = true) =>
    setFavoriteProductNames((prevFavorites) => {
      const otherFavorites = prevFavorites.filter((r) => r !== product.name);
      return isFavoriting ? [...otherFavorites, product.name] : otherFavorites;
    });

  const isProductFavorited = (product: IProduct) =>
    favoriteProductNames.includes(product.name);

  const getSortableRowValues = React.useCallback(
    (product: IProduct): boolean[] => [isProductFavorited(product)],
    [isProductFavorited]
  );

  let sortedProducts = products;

  if (activeSortIndex !== null) {
    sortedProducts = products.sort((a, b) => {
      const aValue = getSortableRowValues(a)[activeSortIndex];
      const bValue = getSortableRowValues(b)[activeSortIndex];
      if (aValue === bValue) {
        return 0;
      }
      if (activeSortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return bValue > aValue ? 1 : -1;
      }
    });
  }

  const getSortParams = (columnIndex: number): ThProps["sort"] => ({
    isFavorites: columnIndex === 0,
    sortBy: {
      index: activeSortIndex as number,
      direction: activeSortDirection as "asc" | "desc",
    },
    onSort: (_event, index, direction) => {
      setActiveSortIndex(index);
      setActiveSortDirection(direction);
    },
    columnIndex,
  });

  const handleAlertModalToggle = (_event: KeyboardEvent | React.MouseEvent) => {
    setAlertModalOpen(!isAlertModalOpen);
    // console.table(_event);
  };

  const handleAlertNameInputChange = (_event: any, value: string) => {
    setAlertNameValue(value);
  };

  const handleAlertOptionInputChange = (_event: any, value: string) => {
    setAlertOption(value);
  };

  const options = [
    { value: "select one", label: "Select one", disabled: false },
    { value: "instantly", label: "Instantly", disabled: false },
    { value: "once-daily", label: "Once a day", disabled: false },
    { value: "once-weekly", label: "Once a week", disabled: false },
    { value: "once-monthly", label: "Once a month", disabled: false },
  ];

  return (
    <>
      <Table aria-label="Product list">
        <Thead>
          <Tr>
            <Th sort={getSortParams(0)} screenReaderText={"Favorites"} />
            <Th aria-label="Name">{columnNames.name}</Th>
            <Th aria-label="Current version">{columnNames.currentVersion}</Th>
            <Th aria-label="Vulnerabilities">{columnNames.vulnerabilities}</Th>
            <Th aria-label="Advisories">{columnNames.advisories}</Th>
            <Th aria-label="Policy violations">
              {columnNames.policyViolations}
            </Th>
            <Th aria-label="Components">Components</Th>
            <Th screenReaderText="Alert" />
            <Th screenReaderText="Actions"></Th>
          </Tr>
        </Thead>
        {sortedProducts.map((product: IProduct, rowIndex: number) => {
          const expandedCellKey = expandedCells[product.name];
          const isRowExpanded = !!expandedCellKey;

          const tabContent = {
            name: (
              <div className={spacing.mMd}>
                Lorem ipsum sit dolor. Lorem ipsum sit dolor. Lorem ipsum sit
                dolor. Lorem ipsum sit dolor. Lorem ipsum sit dolor. Lorem ipsum
                sit dolor. Lorem ipsum sit dolor. Lorem ipsum sit dolor. Lorem
                ipsum sit dolor. Lorem ipsum sit dolor. Lorem ipsum sit dolor.
                Lorem ipsum sit dolor. Lorem ipsum sit dolor. Lorem ipsum sit
                dolor. Lorem ipsum sit dolor. Lorem ipsum sit dolor. Lorem ipsum
                sit dolor. Lorem ipsum sit dolor.
              </div>
            ),
            currentVersion: (
              <div className={spacing.mMd}>
                Some version-specific metadata here.
              </div>
            ),
            vulnerabilities: (
              <div className={spacing.mMd}>
                <Table aria-label="Vulnerabilities table" variant={"compact"}>
                  <Thead>
                    <Tr>
                      <Th aria-label="Identifier">ID</Th>
                      <Th aria-label="Description">Description</Th>
                      <Th aria-label="CVSS">CVSS</Th>
                      <Th aria-label="Date published">Date Published</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {product.vulnerabilities?.slice(0, 5).map((vuln) => (
                      <Tr key={vuln.identifier}>
                        <Td dataLabel={"ID"}>{vuln.identifier}</Td>
                        <Td dataLabel={"Description"}>{vuln.description}</Td>
                        <Td dataLabel={"CVSS"}>
                          {vuln.average_severity && (
                            <SeverityShieldAndText
                              value={vuln.average_severity}
                            />
                          )}
                        </Td>
                        <Td dataLabel={"Date published"}>{vuln.published}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </div>
            ),
            advisories: (
              <div className={spacing.mMd}>
                <Table aria-label="Advisories table" variant={"compact"}>
                  <Thead>
                    <Tr>
                      <Th aria-label="Identifier">ID</Th>
                      <Th aria-label="Title">Title</Th>
                      <Th aria-label="Vulnerabilities">Vulnerabilities</Th>
                      <Th aria-label="Modified">Modified</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {product.advisories?.slice(0, 5).map((adv) => (
                      <Tr key={adv.identifier}>
                        <Td dataLabel={"ID"}>{adv.identifier}</Td>
                        <Td dataLabel={"Title"}>{adv.title}</Td>
                        <Td dataLabel={"Vulnerabilities"}>
                          {adv.average_severity && (
                            <SeverityShieldAndText
                              value={adv.average_severity}
                            />
                          )}
                        </Td>
                        <Td dataLabel={"Modified"}>{adv.modified}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </div>
            ),
            policyViolations: (
              <>
                <div className={spacing.mMd}>
                  Allow users to create policies as code, per component and
                  attestation. Lorem ipsum sit dolor. Lorem ipsum sit dolor.
                  Lorem ipsum sit dolor. Lorem ipsum sit dolor.
                </div>
              </>
            ),
          };
          return (
            <Tbody key={product.name} isExpanded={isRowExpanded}>
              <Tr isControlRow>
                {/* PIN */}
                <Td
                  favorites={{
                    isFavorited: isProductFavorited(product),
                    onFavorite: (_event, isFavoriting) =>
                      setProductFavorited(product, isFavoriting),
                    rowIndex,
                  }}
                >
                  <Icon>
                    <ThumbtackIcon />
                  </Icon>
                </Td>
                {/* NAME */}
                <Td width={25} dataLabel={columnNames.name} component="th">
                  <a href="/?path=/story/v2-1-product-explorer--primary-state">
                    {product.name}
                  </a>
                </Td>
                {/* CURRENT VERSION */}
                <Td
                  width={10}
                  dataLabel={columnNames.currentVersion}
                  compoundExpand={compoundExpandParams(
                    product,
                    "currentVersion",
                    rowIndex,
                    1
                  )}
                >
                  <CodeBranchIcon key="icon" /> {product.currentVersion}
                </Td>
                {/* VULNERABILITIES */}
                <Td
                  width={15}
                  dataLabel={columnNames.vulnerabilities}
                  compoundExpand={compoundExpandParams(
                    product,
                    "vulnerabilities",
                    rowIndex,
                    2
                  )}
                >
                  <SBOMVulnerabilities sbomId={product.sbomId} />
                </Td>
                {/* ADVISORIES */}
                <Td
                  width={10}
                  dataLabel={columnNames.advisories}
                  compoundExpand={compoundExpandParams(
                    product,
                    "advisories",
                    rowIndex,
                    3
                  )}
                >
                  <Badge key={1} screenReaderText="Advisories">
                    {product.advisories?.length}
                  </Badge>
                </Td>
                {/* POLICY VIOLATIONS */}
                <Td
                  width={10}
                  dataLabel={columnNames.policyViolations}
                  compoundExpand={compoundExpandParams(
                    product,
                    "policyViolations",
                    rowIndex,
                    3
                  )}
                >
                  <Badge key={2} screenReaderText="Policy Violations">
                    {product.policyViolations}
                  </Badge>
                </Td>
                {/* COMPONENTS */}
                <Td width={10} dataLabel={"Components"}>
                  <CubeIcon key="icon" /> {product.components}
                </Td>
                {/* ALERT */}
                <Td>
                  <Button
                    variant="link"
                    icon={<BellIcon />}
                    onClick={handleAlertModalToggle}
                  />
                </Td>
                {/* ACTIONS */}
                <Td width={10}>
                  <ActionsColumn items={defaultActions(product)} />
                </Td>
              </Tr>
              {isRowExpanded ? (
                <Tr isExpanded={isRowExpanded}>
                  <Td
                    dataLabel={columnNames[expandedCellKey]}
                    noPadding
                    colSpan={12}
                  >
                    <ExpandableRowContent>
                      {tabContent[expandedCellKey]}
                    </ExpandableRowContent>
                  </Td>
                </Tr>
              ) : null}
            </Tbody>
          );
        })}
      </Table>
      <Modal
        variant={ModalVariant.small}
        title="Create alert"
        description="Enter details below to create an alert."
        isOpen={isAlertModalOpen}
        onClose={handleAlertModalToggle}
        actions={[
          <Button
            key="create"
            variant="primary"
            form="alert-modal"
            onClick={handleAlertModalToggle}
          >
            Confirm
          </Button>,
          <Button key="cancel" variant="link" onClick={handleAlertModalToggle}>
            Cancel
          </Button>,
        ]}
      >
        <Form id="alert-modal">
          <FormGroup
            label="Name"
            labelIcon={
              <Popover
                headerContent={<div>Alert name</div>}
                bodyContent={<div>Give your alert a name.</div>}
              >
                <button
                  type="button"
                  aria-label="More info for name field"
                  onClick={(e) => e.preventDefault()}
                  aria-describedby="modal-with-form-form-name"
                  className={formStyles.formGroupLabelHelp}
                >
                  <HelpIcon />
                </button>
              </Popover>
            }
            isRequired
            fieldId="modal-with-form-form-name"
          >
            <TextInput
              isRequired
              type="email"
              id="modal-with-form-form-name"
              name="modal-with-form-form-name"
              value={alertNameValue}
              onChange={handleAlertNameInputChange}
            />
          </FormGroup>
          <FormGroup label="Frequency" fieldId="frequency">
            <FormSelect
              value={alertOption}
              onChange={handleAlertOptionInputChange}
              id="frequency"
              name="frequency"
              aria-label="Frequency"
            >
              {options.map((option, index) => (
                <FormSelectOption
                  isDisabled={option.disabled}
                  key={index}
                  value={option.value}
                  label={option.label}
                />
              ))}
            </FormSelect>
          </FormGroup>
        </Form>
      </Modal>
    </>
  );
};

type ProductListPropsAndCustomArgs = React.ComponentProps<
  typeof ProductList
> & { userStory?: string };

const meta: Meta<ProductListPropsAndCustomArgs> = {
  title: "v2.1/Product List",
  component: ProductList,
  render: ({ userStory, ...args }) => {
    return (
      <>
        {/* <p>User Story: {userStory}</p> */}
        <ProductList {...args}></ProductList>
      </>
    );
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const PrimaryState: Story = {
  args: {
    products: [
      {
        id: "rhtas",
        name: "RH Trusted Artifact Signer",
        currentVersion: "1.0.1",
        tags: ["a", "b", "c"],
        labels: ["security"],
        policyViolations: 46,
        advisories: [advisory_03bb16dc, advisory_87aa81c3, advisory_88a4fc6c],
        components: 12,
        vulnerabilities: [
          cve_20231370,
          cve_20231436,
          cve_202320861,
          cve_202324815,
          cve_202324998,
          cve_202326464,
        ],
        sbomId: "urn:uuid:01932ff3-0fc4-7bf2-8201-5d5e9dc471bd",
      },
      {
        id: "test-space-2",
        name: "siemur/test-space-2",
        tags: ["blue", "yellow", "red", "green", "orange", "purple"],
        labels: ["danger", "info", "warn", "success"],
        policyViolations: 2,
        currentVersion: "3.2.1",
        components: 26,
        advisories: [
          advisory_459c504b,
          advisory_671dd85b,
          advisory_673acfc8,
          advisory_32600b15,
          advisory_d99d1421,
          advisory_ea257645,
          advisory_ee8cff4d,
        ],
        vulnerabilities: [
          cve_202245787,
          cve_20230044,
          cve_20230481,
          cve_20230482,
        ],
        sbomId: "urn:uuid:01932ff3-0fe1-7ca0-8ba6-c26de2fe81d9",
      },
    ],
    userStory: "N/A",
  },
};
