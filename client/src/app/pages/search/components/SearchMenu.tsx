import React from "react";
import { Link } from "react-router-dom";

import {
  Label,
  Menu,
  MenuContent,
  MenuItem,
  MenuList,
  Popper,
  SearchInput,
  Spinner,
} from "@patternfly/react-core";

import { useDebounceValue } from "usehooks-ts";

import { HubRequestParams } from "@app/api/models";
import { FILTER_TEXT_CATEGORY_KEY } from "@app/Constants";
import { SbomSearchContext } from "@app/pages/sbom-list/sbom-context";
import { useFetchAdvisories } from "@app/queries/advisories";
import { useFetchPackages } from "@app/queries/packages";
import { useFetchSBOMs } from "@app/queries/sboms";
import { useFetchVulnerabilities } from "@app/queries/vulnerabilities";

export interface IEntity {
  id: string;
  title: string | null;
  description?: string | null;
  navLink: string;
  type: string;
  typeColor:
    | "purple"
    | "orange"
    | "blue"
    | "cyan"
    | "green"
    | "red"
    | "grey"
    | "gold"
    | undefined;
}

const entityToMenu = (option: IEntity) => {
  return (
    <Link
      key={option.id}
      to={option.navLink}
      style={{ textDecoration: "none" }}
    >
      <MenuItem itemId={option.id} description={option.description}>
        {option.title} <Label color={option.typeColor}>{option.type}</Label>
      </MenuItem>
    </Link>
  );
};

function useAllEntities(filterText: string, disableSearch: boolean) {
  const params: HubRequestParams = {
    filters: [
      { field: FILTER_TEXT_CATEGORY_KEY, operator: "~", value: filterText },
    ],
    page: { pageNumber: 1, itemsPerPage: 5 },
  };

  const {
    isFetching: isFetchingAdvisories,
    result: { data: advisories },
  } = useFetchAdvisories({ ...params }, disableSearch);

  const {
    isFetching: isFetchingPackages,
    result: { data: packages },
  } = useFetchPackages({ ...params }, disableSearch);

  const {
    isFetching: isFetchingSBOMs,
    result: { data: sboms },
  } = useFetchSBOMs({ ...params }, disableSearch);

  const {
    isFetching: isFetchingVulnerabilities,
    result: { data: vulnerabilities },
  } = useFetchVulnerabilities({ ...params }, disableSearch);

  const transformedAdvisories: IEntity[] = advisories.map((item) => ({
    id: `advisory-${item.uuid}`,
    title: item.document_id,
    description: item.title?.substring(0, 75),
    navLink: `/advisories/${item.uuid}`,
    type: "Advisory",
    typeColor: "blue",
  }));

  const transformedPackages: IEntity[] = packages.map((item) => ({
    id: `package-${item.uuid}`,
    title: item.purl,
    navLink: `/packages/${item.uuid}`,
    type: "Package",
    typeColor: "cyan",
  }));

  const transformedSboms: IEntity[] = sboms.map((item) => ({
    id: `sbom-${item.id}`,
    title: item.name,
    description: item.authors.join(", "),
    navLink: `/sboms/${item.id}`,
    type: "SBOM",
    typeColor: "purple",
  }));

  const transformedVulnerabilities: IEntity[] = vulnerabilities.map((item) => ({
    id: `vulnerability-${item.identifier}`,
    title: item.identifier,
    description: item.description?.substring(0, 75),
    navLink: `/vulnerabilities/${item.identifier}`,
    type: "Vulnerability",
    typeColor: "orange",
  }));

  const filterTextLowerCase = filterText.toLowerCase();

  const list = [
    ...transformedVulnerabilities,
    ...transformedSboms,
    ...transformedAdvisories,
    ...transformedPackages,
  ].sort((a, b) => {
    if (a.title?.includes(filterTextLowerCase)) {
      return -1;
    } else if (b.title?.includes(filterTextLowerCase)) {
      return 1;
    } else {
      const aIndex = (a.description || "")
        .toLowerCase()
        .indexOf(filterTextLowerCase);
      const bIndex = (b.description || "")
        .toLowerCase()
        .indexOf(filterTextLowerCase);
      return aIndex - bIndex;
    }
  });

  return {
    isFetching:
      isFetchingAdvisories ||
      isFetchingPackages ||
      isFetchingSBOMs ||
      isFetchingVulnerabilities,
    list,
  };
}

export interface ISearchMenu {
  filterFunction?: (
    list: IEntity[],
    searchString: string
  ) => React.JSX.Element[];
  onChangeSearch: (searchValue: string | undefined) => void;
}

export const SearchMenu: React.FC<ISearchMenu> = ({ onChangeSearch }) => {
  // Search value initial value
  const { tableControls: sbomTableControls } =
    React.useContext(SbomSearchContext);
  const initialSearchValue =
    sbomTableControls.filterState.filterValues[FILTER_TEXT_CATEGORY_KEY]?.[0] ||
    "";

  // Search value
  const [searchValue, setSearchValue] = React.useState(initialSearchValue);
  const [isSearchValueDirty, setIsSearchValueDirty] = React.useState(false);

  // Debounce Search value
  const [debouncedSearchValue, setDebouncedSearchValue] = useDebounceValue(
    searchValue,
    500
  );

  React.useEffect(() => {
    setDebouncedSearchValue(searchValue);
  }, [setDebouncedSearchValue, searchValue]);

  // Fetch all entities
  const { isFetching, list: entityList } = useAllEntities(
    debouncedSearchValue,
    !isSearchValueDirty
  );

  const [isAutocompleteOpen, setIsAutocompleteOpen] =
    React.useState<boolean>(false);

  const searchInputRef: React.RefObject<HTMLInputElement> = React.useRef(null);
  const autocompleteRef: React.RefObject<HTMLInputElement> = React.useRef(null);

  const onChangeSearchValue = (newValue: string) => {
    if (
      newValue !== "" &&
      searchInputRef &&
      searchInputRef.current &&
      searchInputRef.current.contains(document.activeElement)
    ) {
      setIsAutocompleteOpen(true);
    } else {
      setIsAutocompleteOpen(false);
    }

    setSearchValue(newValue);
    setIsSearchValueDirty(true);
  };

  const onClearSearchValue = () => {
    setSearchValue("");
  };

  const onSubmitInput = () => {
    onChangeSearch(searchValue);
  };

  React.useEffect(() => {
    const handleMenuKeys = (event: any) => {
      if (
        isAutocompleteOpen &&
        searchInputRef.current &&
        searchInputRef.current === event.target
      ) {
        // the escape key closes the autocomplete menu and keeps the focus on the search input.
        if (event.key === "Escape") {
          setIsAutocompleteOpen(false);
          searchInputRef.current.focus();
          // the up and down arrow keys move browser focus into the autocomplete menu
        } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          const firstElement = autocompleteRef.current?.querySelector(
            "li > button:not(:disabled)"
          );
          firstElement && (firstElement as HTMLElement)?.focus();
          event.preventDefault(); // by default, the up and down arrow keys scroll the window
          // the tab, enter, and space keys will close the menu, and the tab key will move browser
          // focus forward one element (by default)
        } else if (
          event.key === "Tab" ||
          event.key === "Enter" ||
          event.key === "Space"
        ) {
          setIsAutocompleteOpen(false);
          if (event.key === "Enter" || event.key === "Space") {
            event.preventDefault();
          }
        }
        // If the autocomplete is open and the browser focus is in the autocomplete menu
        // hitting tab will close the autocomplete and but browser focus back on the search input.
      } else if (
        isAutocompleteOpen &&
        autocompleteRef.current?.contains(event.target) &&
        event.key === "Tab"
      ) {
        event.preventDefault();
        setIsAutocompleteOpen(false);
        searchInputRef.current?.focus();
      }
    };

    // The autocomplete menu should close if the user clicks outside the menu.
    const handleClickOutside = (event: { target: any }) => {
      if (
        isAutocompleteOpen &&
        autocompleteRef &&
        autocompleteRef.current &&
        !autocompleteRef.current.contains(event.target)
      ) {
        setIsAutocompleteOpen(false);
      }
    };

    window.addEventListener("keydown", handleMenuKeys);
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleMenuKeys);
      window.removeEventListener("click", handleClickOutside);
    };
  }, [isAutocompleteOpen]);

  const autocomplete = (
    <Menu
      ref={autocompleteRef}
      style={{
        maxWidth: "450px",
        maxHeight: "450px",
        overflow: "scroll",
        overflowX: "hidden",
        overflowY: "auto",
      }}
    >
      <MenuContent>
        <MenuList>
          {isFetching ? (
            <MenuItem itemId="loading">
              <Spinner size="sm" />
            </MenuItem>
          ) : (
            entityList.map(entityToMenu)
          )}
        </MenuList>
      </MenuContent>
    </Menu>
  );

  const searchInput = (
    <SearchInput
      placeholder="Search for an SBOM, Package, or Vulnerability"
      value={searchValue}
      onChange={(_event, value) => onChangeSearchValue(value)}
      onClear={onClearSearchValue}
      onSearch={onSubmitInput}
      onKeyDown={(event: React.KeyboardEvent) => {
        if (event.key && event.key !== "Enter") return;
      }}
      ref={searchInputRef}
      id="autocomplete-search"
    />
  );

  return (
    <Popper
      trigger={searchInput}
      triggerRef={searchInputRef}
      popper={autocomplete}
      popperRef={autocompleteRef}
      isVisible={(isAutocompleteOpen && entityList.length > 0) || isFetching}
      enableFlip={false}
      // append the autocomplete menu to the search input in the DOM for the sake of the keyboard navigation experience
      appendTo={() =>
        document.querySelector("#autocomplete-search") as HTMLElement
      }
    />
  );
};
