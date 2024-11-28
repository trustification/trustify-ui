import React from "react";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuList,
  Popper,
  SearchInput,
} from "@patternfly/react-core";
import { FILTER_TEXT_CATEGORY_KEY } from "@app/Constants";
import { VulnerabilitySearchContext } from "@app/pages/vulnerability-list/vulnerability-context";
import { SbomSearchContext } from "@app/pages/sbom-list/sbom-context";
import { Label } from "@patternfly/react-core";
import { AdvisorySearchContext } from "@app/pages/advisory-list/advisory-context";
import { PackageSearchContext } from "@app/pages/package-list/package-context";

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

function useAllEntities() {
  const [entityList, setEntityList] = React.useState<IEntity[]>([]);

  const {
    tableControls: { currentPageItems: advisories },
  } = React.useContext(AdvisorySearchContext);

  const {
    tableControls: { currentPageItems: packages },
  } = React.useContext(PackageSearchContext);

  const {
    tableControls: { currentPageItems: sboms, filterState: sbomFilterState },
  } = React.useContext(SbomSearchContext);

  const {
    tableControls: { currentPageItems: vulnerabilities },
  } = React.useContext(VulnerabilitySearchContext);

  React.useEffect(() => {
    function fetchAllEntities() {
      const tmpArray: IEntity[] = [];

      const transformedAdvisories: IEntity[] = advisories.map((item) => ({
        id: item.identifier,
        title: item.identifier,
        description: item.title?.substring(0, 75),
        navLink: `/advisories/${item.uuid}`,
        type: "Advisory",
        typeColor: "blue",
      }));

      const transformedPackages: IEntity[] = packages.map((item) => ({
        id: item.uuid,
        title: item.decomposedPurl ? item.decomposedPurl?.name : item.purl,
        description: item.decomposedPurl?.namespace,
        navLink: `/packages/${item.uuid}`,
        type: "Package",
        typeColor: "cyan",
      }));

      const transformedSboms: IEntity[] = sboms.map((item) => ({
        id: item.id,
        title: item.name,
        description: item.authors.join(", "),
        navLink: `/sboms/${item.id}`,
        type: "SBOM",
        typeColor: "purple",
      }));

      const transformedVulnerabilities: IEntity[] = vulnerabilities.map(
        (item) => ({
          id: item.identifier,
          title: item.identifier,
          description: item.description?.substring(0, 75),
          navLink: `/vulnerabilities/${item.identifier}`,
          type: "CVE",
          typeColor: "orange",
        })
      );

      tmpArray.push(
        ...transformedAdvisories,
        ...transformedPackages,
        ...transformedSboms,
        ...transformedVulnerabilities
      );
      setEntityList(tmpArray);
    }
    // fetch on load
    fetchAllEntities();
  }, [advisories, packages, sboms, vulnerabilities]);
  return {
    list: entityList,
    defaultValue:
      sbomFilterState.filterValues[FILTER_TEXT_CATEGORY_KEY]?.[0] || "",
  };
}

export interface ISearchMenu {
  onChangeSearch: (searchValue: string | undefined) => void;
}

export const SearchMenu: React.FC<ISearchMenu> = ({ onChangeSearch }) => {
  const { list: entityList, defaultValue } = useAllEntities();

  const [searchValue, setSearchValue] = React.useState<string | undefined>(
    defaultValue
  );
  const [autocompleteOptions, setAutocompleteOptions] = React.useState<
    React.JSX.Element[]
  >([]);
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

      // When the value of the search input changes, build a list of no more than 10 autocomplete options.
      // Options which start with the search input value are listed first, followed by options which contain
      // the search input value.
      let options: React.JSX.Element[] = entityList
        .filter(
          (option) =>
            option.id.toLowerCase().startsWith(newValue.toLowerCase()) ||
            option.title?.toLowerCase().startsWith(newValue.toLowerCase()) ||
            option.description?.toLowerCase().startsWith(newValue.toLowerCase())
        )
        .map((option) => (
          <MenuItem
            itemId={option.id}
            key={option.id}
            description={option.description}
            to={option.navLink}
          >
            {option.title} <Label color={option.typeColor}>{option.type}</Label>
          </MenuItem>
        ));

      if (options.length > 10) {
        options = options.slice(0, 10);
      } else {
        options = [
          ...options,
          ...entityList
            .filter(
              (option: IEntity) =>
                !option.id.startsWith(newValue.toLowerCase()) &&
                option.id.includes(newValue.toLowerCase())
            )
            .map((option: IEntity) => (
              <MenuItem itemId={option.id} key={option.id}>
                {option.id}
              </MenuItem>
            )),
        ].slice(0, 10);
      }

      // The menu is hidden if there are no options
      setIsAutocompleteOpen(options.length > 0);
      setAutocompleteOptions(options);
    } else {
      setIsAutocompleteOpen(false);
    }

    setSearchValue(newValue);
  };

  const onClearSearchValue = () => {
    setSearchValue("");
    onChangeSearch("");
  };

  const onSubmitInput = () => {
    onChangeSearch(searchValue);
  };

  // Whenever an autocomplete option is selected, set the search input value, close the menu, and put the browser
  // focus back on the search input
  const onSelect = (e: any, itemId?: string | number | undefined) => {
    e?.stopPropagation();
    setSearchValue(itemId as string);
    setIsAutocompleteOpen(false);
    searchInputRef.current?.focus();
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
      onSelect={onSelect}
      style={{ maxWidth: "450px" }}
    >
      <MenuContent>
        <MenuList>{autocompleteOptions}</MenuList>
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
      isVisible={isAutocompleteOpen}
      enableFlip={false}
      // append the autocomplete menu to the search input in the DOM for the sake of the keyboard navigation experience
      appendTo={() =>
        document.querySelector("#autocomplete-search") as HTMLElement
      }
    />
  );
};
