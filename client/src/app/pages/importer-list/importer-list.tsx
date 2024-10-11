import React from "react";

import { AxiosError } from "axios";

import {
  Button,
  ButtonVariant,
  Form,
  FormGroup,
  FormSelect,
  FormSelectOption,
  Label,
  Modal,
  ModalVariant,
  PageSection,
  PageSectionVariants,
  Popover,
  Tab,
  Tabs,
  TabTitleText,
  Text,
  TextArea,
  TextContent,
  TextInput,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "@patternfly/react-core";
import {
  ActionsColumn,
  Caption,
  ExpandableRowContent,
  Table,
  Tbody,
  TbodyProps,
  Td,
  Th,
  Thead,
  Tr,
  TrProps,
} from "@patternfly/react-table";
import styles from "@patternfly/react-styles/css/components/Table/table";

import {
  ConfirmDialog,
  ConfirmDialogProps,
} from "@app/components/ConfirmDialog";
import { NotificationsContext } from "@app/components/NotificationsContext";
import {
  useDeleteIporterMutation,
  useFetchImporterReports,
  useFetchImporters,
  useUpdateImporterMutation,
} from "@app/queries/importers";
import { getAxiosErrorMessage } from "@app/utils/utils";

import { client } from "@app/axios-config/apiInit";
import {
  forceRunImporter,
  Importer,
  ImporterConfiguration,
  SbomImporter,
} from "@app/client";
import { FilterToolbar, FilterType } from "@app/components/FilterToolbar";
import { SimplePagination } from "@app/components/SimplePagination";
import {
  ConditionalTableBody,
  TableHeaderContentWithControls,
  TableRowContentWithControls,
} from "@app/components/TableControls";
import { useLocalTableControls } from "@app/hooks/table-controls";

import { ImporterForm } from "./components/importer-form";
import { ImporterStatusIcon } from "./components/importer-status-icon";

export const ImporterList: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleModalToggle = (_event: KeyboardEvent | React.MouseEvent) => {
    setIsModalOpen(!isModalOpen);
  };

  //

  const [isModal2Open, setIsModal2Open] = React.useState(false);

  const handleModal2Toggle = (_event: KeyboardEvent | React.MouseEvent) => {
    setIsModal2Open(!isModal2Open);
  };

  //
  const [draggedItemId, setDraggedItemId] = React.useState<string | null>(null);
  const [draggingToItemIndex, setDraggingToItemIndex] = React.useState<
    number | null
  >(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [itemOrder, setItemOrder] = React.useState(["row1", "row2", "row3"]);
  const [tempItemOrder, setTempItemOrder] = React.useState<string[]>([]);

  const bodyRef = React.useRef<HTMLTableSectionElement>();

  const onDragStart: TrProps["onDragStart"] = (evt) => {
    evt.dataTransfer.effectAllowed = "move";
    evt.dataTransfer.setData("text/plain", evt.currentTarget.id);
    const draggedItemId = evt.currentTarget.id;

    evt.currentTarget.classList.add(styles.modifiers.ghostRow);
    evt.currentTarget.setAttribute("aria-pressed", "true");

    setDraggedItemId(draggedItemId);
    setIsDragging(true);
  };

  const moveItem = (arr: string[], i1: string, toIndex: number) => {
    const fromIndex = arr.indexOf(i1);
    if (fromIndex === toIndex) {
      return arr;
    }
    const temp = arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, temp[0]);

    return arr;
  };

  const move = (itemOrder: string[]) => {
    const ulNode = bodyRef.current as any;
    const nodes = Array.from(ulNode.children);
    if (
      nodes.map((node: any) => node.id).every((id, i) => id === itemOrder[i])
    ) {
      return;
    }
    while (ulNode.firstChild) {
      ulNode.removeChild(ulNode.lastChild);
    }

    itemOrder.forEach((id) => {
      ulNode.appendChild(nodes.find((n: any) => n.id === id));
    });
  };

  const onDragCancel = () => {
    Array.from((bodyRef as any).current.children).forEach((el: any) => {
      el.classList.remove(styles.modifiers.ghostRow);
      el.setAttribute("aria-pressed", "false");
    });
    setDraggedItemId(null);
    setDraggingToItemIndex(null);
    setIsDragging(false);
  };

  const onDragLeave: TbodyProps["onDragLeave"] = (evt) => {
    if (!isValidDrop(evt)) {
      move(itemOrder);
      setDraggingToItemIndex(null);
    }
  };

  const isValidDrop = (
    evt: React.DragEvent<HTMLTableSectionElement | HTMLTableRowElement>
  ) => {
    const ulRect = (bodyRef as any).current.getBoundingClientRect();
    return (
      evt.clientX > ulRect.x &&
      evt.clientX < ulRect.x + ulRect.width &&
      evt.clientY > ulRect.y &&
      evt.clientY < ulRect.y + ulRect.height
    );
  };

  const onDrop: TrProps["onDrop"] = (evt) => {
    if (isValidDrop(evt)) {
      setItemOrder(tempItemOrder);
    } else {
      onDragCancel();
    }
  };

  const onDragOver: TbodyProps["onDragOver"] = (evt) => {
    evt.preventDefault();

    const curListItem = (evt.target as HTMLTableSectionElement).closest("tr");
    if (
      !curListItem ||
      !(bodyRef as any).current.contains(curListItem) ||
      curListItem.id === draggedItemId
    ) {
      return null;
    } else {
      const dragId = curListItem.id;
      const newDraggingToItemIndex = Array.from(
        (bodyRef as any).current.children
      ).findIndex((item: any) => item.id === dragId);
      if (newDraggingToItemIndex !== draggingToItemIndex) {
        const tempItemOrder = moveItem(
          [...itemOrder],
          draggedItemId!,
          newDraggingToItemIndex
        );
        move(tempItemOrder);
        setDraggingToItemIndex(newDraggingToItemIndex);
        setTempItemOrder(tempItemOrder);
      }
    }
  };

  const onDragEnd: TrProps["onDragEnd"] = (evt) => {
    const target = evt.target as HTMLTableRowElement;
    target.classList.remove(styles.modifiers.ghostRow);
    target.setAttribute("aria-pressed", "false");
    setDraggedItemId(null);
    setDraggingToItemIndex(null);
    setIsDragging(false);
  };

  const columns = ["Name", "Abbreviation", "Description", "Action"];
  const rows = [
    {
      id: "row1",
      name: "Red Hat",
      abbreviation: "RH",
      description: "CSAF Files provided by Red Hat",
    },
    {
      id: "row2",
      name: "OSV",
      abbreviation: "OSV",
      description: "A distributed vulnerability database for Open Source",
    },
    {
      id: "row3",
      name: "CVE",
      abbreviation: "CVE",
      description: "Vulnerability database for https://www.cve.org/",
    },
  ];

  //

  const [option, setOption] = React.useState("choose");

  const options = [
    { value: "select one", label: "Select one", disabled: false },
    { value: "git", label: "Git", disabled: false },
  ];

  const handleOptionChange = (
    _event: React.FormEvent<HTMLSelectElement>,
    value: string
  ) => {
    setOption(value);
  };

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">Vulnerability Database</Text>
          <Text component="p">
            Order your Vendors according to your preferences. The top Vendor
            represents the highest priority.
          </Text>
        </TextContent>
      </PageSection>
      <PageSection>
        <div
          style={{
            backgroundColor: "var(--pf-v5-global--BackgroundColor--100)",
          }}
        >
          <Toolbar>
            <ToolbarContent>
              <ToolbarItem>
                <Button
                  type="button"
                  id="create-importer"
                  aria-label="Create new importer"
                  variant={ButtonVariant.primary}
                  onClick={() => setIsModalOpen(true)}
                >
                  Create Vendor
                </Button>
              </ToolbarItem>
            </ToolbarContent>
          </Toolbar>

          <Table
            aria-label="Draggable table"
            className={isDragging ? styles.modifiers.dragOver : ""}
            ref={bodyRef as any}
          >
            <Thead>
              <Tr>
                <Th screenReaderText="Drag and drop" />
                <Th screenReaderText="Row expansion" />
                {columns.map((column, columnIndex) => (
                  <Th key={columnIndex}>{column}</Th>
                ))}
              </Tr>
            </Thead>

            <>
              {/* <Tbody ref={bodyRef as any}> */}
              {rows.map((row: any, rowIndex) => {
                const rowCellsToBuild = Object.keys(row).filter(
                  (rowCell) => rowCell !== "id"
                );
                return (
                  <Tbody
                    key={rowIndex}
                    id={row.id}
                    onDragOver={onDragOver}
                    onDrop={onDragOver}
                    onDragLeave={onDragLeave}
                  >
                    <Tr
                      draggable
                      onDrop={onDrop}
                      onDragEnd={onDragEnd}
                      onDragStart={onDragStart}
                    >
                      <Td
                        draggableRow={{
                          id: `draggable-row-${row.id}`,
                        }}
                      />
                      <Td expand={{ isExpanded: rowIndex === 1, rowIndex }} />
                      {rowCellsToBuild.map((key, keyIndex) => (
                        <Td
                          key={`${rowIndex}_${keyIndex}`}
                          dataLabel={columns[keyIndex]}
                        >
                          {row[key]}
                        </Td>
                      ))}
                      <Td>
                        <Button
                          variant="secondary"
                          onClick={() => setIsModal2Open(true)}
                        >
                          Add Source
                        </Button>
                      </Td>
                    </Tr>
                    {rowIndex === 1 && (
                      <Tr isExpanded={true}>
                        {/* <Td /> */}
                        <Td colSpan={8}>
                          <ExpandableRowContent>
                            <Table
                              aria-label="Simple table"
                              variant={"compact"}
                            >
                              <Thead>
                                <Tr>
                                  <Th>Type</Th>
                                  <Th>Source</Th>
                                  <Th>Execution Cron</Th>
                                </Tr>
                              </Thead>
                              <Tbody>
                                <Tr>
                                  <Td>Git</Td>
                                  <Td>
                                    https://github.com/RConsortium/r-advisory-database
                                  </Td>
                                  <Td>Every monday at 00:00:00</Td>
                                </Tr>
                                <Tr>
                                  <Td>Git</Td>
                                  <Td>
                                    https://github.com/rustsec/advisory-db
                                  </Td>
                                  <Td>Every monday at 00:00:00</Td>
                                </Tr>
                              </Tbody>
                            </Table>
                          </ExpandableRowContent>
                        </Td>
                      </Tr>
                    )}
                  </Tbody>
                );
              })}
            </>
          </Table>
        </div>

        <Modal
          variant={ModalVariant.small}
          title="Create Vendor"
          isOpen={isModalOpen}
          onClose={handleModalToggle}
          actions={[
            <Button key="confirm" variant="primary" onClick={handleModalToggle}>
              Save
            </Button>,
            <Button key="cancel" variant="link" onClick={handleModalToggle}>
              Cancel
            </Button>,
          ]}
        >
          <Form>
            <FormGroup label="Name" isRequired fieldId="simple-form-name-01">
              <TextInput
                isRequired
                type="text"
                id="simple-form-name-01"
                name="simple-form-name-01"
                aria-describedby="simple-form-name-01-helper"
              />
            </FormGroup>
            <FormGroup
              label="Abreviation"
              isRequired
              fieldId="simple-form-email-01"
            >
              <TextInput
                isRequired
                type="email"
                id="simple-form-email-01"
                name="simple-form-email-01"
              />
            </FormGroup>
            <FormGroup
              label="Description"
              isRequired
              fieldId="simple-form-phone-01"
            >
              <TextArea
                isRequired
                type="tel"
                id="simple-form-phone-01"
                name="simple-form-phone-01"
                placeholder="555-555-5555"
              />
            </FormGroup>
          </Form>
        </Modal>

        <Modal
          variant={ModalVariant.small}
          title="Create Source"
          isOpen={isModal2Open}
          onClose={handleModal2Toggle}
          actions={[
            <Button
              key="confirm"
              variant="primary"
              onClick={handleModal2Toggle}
            >
              Save
            </Button>,
            <Button key="cancel" variant="link" onClick={handleModal2Toggle}>
              Cancel
            </Button>,
          ]}
        >
          <Form>
            <FormGroup label="Period" isRequired fieldId="simple-form-name-01">
              <TextInput
                isRequired
                type="text"
                id="simple-form-name-01"
                name="simple-form-name-01"
                aria-describedby="simple-form-name-01-helper"
                value="*/5 * * * *"
              />
            </FormGroup>
            <FormGroup label="Type" fieldId="horizontal-form-title">
              <FormSelect
                value={option}
                onChange={handleOptionChange}
                id="horizontal-form-title"
                name="horizontal-form-title"
                aria-label="Your title"
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
            {option === "git" && (
              <>
                <FormGroup
                  label="Git URL"
                  isRequired
                  fieldId="simple-form-email-01"
                >
                  <TextInput
                    isRequired
                    type="email"
                    id="simple-form-email-01"
                    name="simple-form-email-01"
                  />
                </FormGroup>
                <FormGroup
                  label="Branch"
                  isRequired
                  fieldId="simple-form-phone-01"
                >
                  <TextInput
                    isRequired
                    type="tel"
                    id="simple-form-phone-01"
                    name="simple-form-phone-01"
                    placeholder="main"
                  />
                </FormGroup>
              </>
            )}
          </Form>
        </Modal>
      </PageSection>
    </>
  );
};
