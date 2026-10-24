import React, { useRef, useState } from "react";

import type { AxiosError } from "axios";

import {
  Alert,
  Button,
  Divider,
  Menu,
  MenuContainer,
  MenuContent,
  MenuItem,
  type MenuItemProps,
  MenuList,
  MenuSearch,
  MenuSearchInput,
  MenuToggle,
  SearchInput,
  type SearchInputProps,
} from "@patternfly/react-core";
import AngleLeftIcon from "@patternfly/react-icons/dist/esm/icons/angle-left-icon";
import TimesIcon from "@patternfly/react-icons/dist/esm/icons/times-icon";

import { DrilldownMenuItem } from "./DrilldownMenuItem";
import styles from "./DrilldownSelect.module.css";

export type SearchQuery =
  | {
      type: "filterText";
      value: string;
    }
  | {
      type: "drillIn";
      parentIds: string[];
    };

/**
 * Option type for DrilldownSelect component
 * @template TData - Optional data type to attach to each option
 */
export type DrilldownOption = {
  /** Unique identifier for the option */
  id: string;
  /** Display name for the option */
  name: string;
  /** Whether or not it has children */
  hasChildren: boolean;
  /** Arbitrary data attached to this option */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- allowed
  value?: any;
  itemProps?: Omit<MenuItemProps, "itemId">;
};

/**
 * Props for DrilldownSelect component
 */
export interface IDrilldownSelectProps {
  /** Available options to select from */
  options: DrilldownOption[];
  /** Whether the select is in loading state */
  isLoading?: boolean;
  /** Error while loading data */
  fetchError?: AxiosError;

  value?: DrilldownOption;
  /** Callback when selection changes */
  onChange: (option: DrilldownOption | null) => void;

  /** Placeholder text when no value selected */
  placeholder?: React.ReactNode;
  /** Node to render when isLoading=true */
  loading?: React.ReactNode;
  /** Node to render when isLoading=true */
  noResults?: React.ReactNode;

  /** Whether the menu is open (controlled mode) */
  isOpen?: boolean;
  /** Set menu open state (controlled mode) */
  setIsOpen?: (value: boolean) => void;
  /** Default open state (uncontrolled mode) */
  defaultIsOpen?: boolean;
  /** Whether the select is disabled */
  isDisabled?: boolean;

  // Search input props
  searchInputProps?: Omit<SearchInputProps, "value" | "onChange" | "onClear">;

  // Search
  searchQuery: SearchQuery;
  onSearchQueryChange: (value: SearchQuery) => void;
}

const ROOT_MENU_ID = "rootMenu";

export const DrilldownSelect = ({
  options,
  isLoading,
  fetchError,

  value,
  onChange,

  placeholder = "Select one",
  loading = "Loading...",
  noResults = "No results",

  isOpen: controlledIsOpen,
  setIsOpen: controlledSetIsOpen,
  defaultIsOpen = false,
  isDisabled,

  searchInputProps,

  searchQuery,
  onSearchQueryChange,
}: IDrilldownSelectProps) => {
  const [searchInputValue, setSearchInputValue] = React.useState("");

  // Support both controlled and uncontrolled modes
  const [internalIsOpen, setInternalIsOpen] = useState(defaultIsOpen);
  const isOpen = controlledIsOpen ?? internalIsOpen;
  const setIsOpen = controlledSetIsOpen ?? setInternalIsOpen;

  const searchInputRef = useRef<HTMLInputElement>(null);

  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [activeMenu, setActiveMenu] = useState<string>(ROOT_MENU_ID);

  const parentIdMap = React.useRef(new Map<string, DrilldownOption>());
  const drillDirection = React.useRef<"in" | "out" | null>(null);

  const currentParentId =
    searchQuery.type === "drillIn"
      ? searchQuery.parentIds[searchQuery.parentIds.length - 1]
      : undefined;

  const handleSearchInputChange = (value: string) => {
    setSearchInputValue(value);
    if (value) {
      onSearchQueryChange({ type: "filterText", value });
    } else {
      onSearchQueryChange({ type: "drillIn", parentIds: [] });
    }
  };

  const handleOnDrillIn = (option: DrilldownOption) => {
    if (searchQuery.type === "drillIn") {
      drillDirection.current = "in";
      parentIdMap.current.set(option.id, option);
      onSearchQueryChange({
        type: "drillIn",
        parentIds: [...searchQuery.parentIds, option.id],
      });
      setActiveMenu(option.id);
    }
  };

  const handleOnDrillOut = () => {
    if (searchQuery.type === "drillIn") {
      drillDirection.current = "out";
      if (currentParentId) parentIdMap.current.delete(currentParentId);

      const newParentIds = searchQuery.parentIds.slice(0, -1);
      onSearchQueryChange({
        type: "drillIn",
        parentIds: newParentIds,
      });
      setActiveMenu(newParentIds[newParentIds.length - 1] ?? ROOT_MENU_ID);
    }
  };

  const handleOnSelectMenu = (event?: React.MouseEvent, itemId?: string) => {
    if (currentParentId === itemId) {
      event?.stopPropagation();
      handleOnDrillOut();
    } else {
      const selected = options.find((option) => option.id === itemId);
      if (selected) {
        onChange(selected);
        setIsOpen(false);
      }
    }
  };

  const onToggleClick = () => {
    setIsOpen(!isOpen);
    setActiveMenu(ROOT_MENU_ID);
  };

  // PF's built-in drilldown focus (containsDrilldown + DrilldownMenu) relies on CSS
  // transitionend events between statically nested menus. Since we load data async and
  // render a single flat MenuList, there are no nested menus to transition between.
  // We manually focus the first item using PF's own selector from allowTabFirstItem().
  React.useEffect(() => {
    if (!drillDirection.current || isLoading || !menuRef.current) {
      return;
    }
    requestAnimationFrame(() => {
      const firstItem = menuRef.current?.querySelector<HTMLElement>(
        "ul button:not(:disabled), ul a:not(:disabled)",
      );
      if (firstItem) {
        firstItem.focus();
        drillDirection.current = null;
      }
    });
  }, [options, isLoading]);

  const toggle = (
    <MenuToggle
      className={styles.toggle}
      ref={toggleRef}
      onClick={onToggleClick}
      isExpanded={isOpen}
      isDisabled={isDisabled}
      badge={
        value && (
          <Button
            key="clean"
            component={"span"}
            variant="plain"
            aria-label="Clear selection"
            icon={<TimesIcon />}
            onClick={(e) => {
              e.stopPropagation();
              onChange(null);
            }}
          />
        )
      }
      isFullWidth
    >
      {value?.name ?? placeholder}
    </MenuToggle>
  );

  const menu = (
    <Menu
      id={ROOT_MENU_ID}
      activeMenu={activeMenu}
      ref={menuRef}
      isScrollable
      onSelect={handleOnSelectMenu}
      onKeyDown={(event) => {
        if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;

        const target = event.target as HTMLElement;
        const li = target.closest("li");
        if (!li) return;

        const focusable = Array.from(
          li.querySelectorAll<HTMLElement>(
            "button:not(:disabled), a:not(:disabled)",
          ),
        );
        if (focusable.length <= 1) return;

        const currentIndex = focusable.indexOf(target);
        if (currentIndex === -1) return;

        const nextIndex =
          event.key === "ArrowRight"
            ? Math.min(currentIndex + 1, focusable.length - 1)
            : Math.max(currentIndex - 1, 0);

        if (nextIndex !== currentIndex) {
          event.preventDefault();
          focusable[nextIndex]!.focus();
        }
      }}
    >
      <MenuSearch>
        <MenuSearchInput>
          <SearchInput
            ref={searchInputRef}
            value={searchInputValue}
            onChange={(_event, value) => handleSearchInputChange(value)}
            onClear={(e) => {
              e.stopPropagation();
              handleSearchInputChange("");
            }}
            {...searchInputProps}
          />
        </MenuSearchInput>
      </MenuSearch>
      <Divider />
      <MenuContent maxMenuHeight={"300px"}>
        <MenuList>
          {currentParentId && (
            <>
              <MenuItem
                itemId={currentParentId}
                component={"button"}
                icon={<AngleLeftIcon />}
              >
                {parentIdMap.current.get(currentParentId)?.name ??
                  currentParentId}
              </MenuItem>
              <Divider role="separator" component="li" />
            </>
          )}
          {isLoading ? (
            <MenuItem isDisabled>{loading}</MenuItem>
          ) : fetchError ? (
            <Alert
              variant="danger"
              isInline
              isPlain
              title="Error while loading data"
            />
          ) : options.length > 0 ? (
            options.map((option) => (
              <DrilldownMenuItem
                key={option.id}
                searchQuery={searchQuery}
                option={option}
                hasChildren={option.hasChildren}
                onDrillIn={handleOnDrillIn}
              />
            ))
          ) : (
            <MenuItem isDisabled>{noResults}</MenuItem>
          )}
        </MenuList>
      </MenuContent>
    </Menu>
  );

  return (
    <MenuContainer
      menu={menu}
      menuRef={menuRef}
      toggle={toggle}
      toggleRef={toggleRef}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      onOpenChangeKeys={["Escape"]}
      onToggleKeydown={(event) => {
        if (event.key === "ArrowDown") {
          event.preventDefault();
          searchInputRef?.current?.focus();
        } else if (event.key === "ArrowUp") {
          event.preventDefault();
          const lastItem = menuRef.current?.querySelector<HTMLElement>(
            "ul li:last-child button:not(:disabled), ul li:last-child a:not(:disabled)",
          );
          lastItem?.focus();
        }
      }}
      popperProps={{ appendTo: "inline" }}
    />
  );
};
