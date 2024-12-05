import { HubRequestParams } from "@app/api/models";
import { FILTER_TEXT_CATEGORY_KEY } from "@app/Constants";
import { useFetchAdvisories } from "@app/queries/advisories";
import { useFetchPackages } from "@app/queries/packages";
import { useFetchSBOMs } from "@app/queries/sboms";
import { useFetchVulnerabilities } from "@app/queries/vulnerabilities";
import {
  Label,
  Menu,
  MenuContent,
  MenuItem,
  MenuList,
  Popper,
  SearchInput,
} from "@patternfly/react-core";
import React from "react";
import { Link } from "react-router-dom";

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

// Filter function
export function filterEntityListByValue(list: IEntity[], searchString: string) {
  // When the value of the search input changes, build a list of no more than 10 autocomplete options.
  // Options which start with the search input value are listed first, followed by options which contain
  // the search input value.
  let options: React.JSX.Element[] = list
    .filter(
      (option) =>
        option.id.toLowerCase().startsWith(searchString.toLowerCase()) ||
        option.title?.toLowerCase().startsWith(searchString.toLowerCase()) ||
        option.description?.toLowerCase().startsWith(searchString.toLowerCase())
    )
    .map(entityToMenu);

  if (options.length > 10) {
    options = options.slice(0, 10);
  } else {
    options = [
      ...options,
      ...list
        .filter(
          (option: IEntity) =>
            !option.id.startsWith(searchString.toLowerCase()) &&
            option.id.includes(searchString.toLowerCase())
        )
        .map(entityToMenu),
    ].slice(0, 10);
  }

  return options;
}

function useAllEntities(filterText: string) {
  const params: HubRequestParams = {
    filters: [
      { field: FILTER_TEXT_CATEGORY_KEY, operator: "~", value: filterText },
    ],
    page: { pageNumber: 1, itemsPerPage: 10 },
  };

  const {
    result: { data: advisories },
  } = useFetchAdvisories({ ...params });

  const {
    result: { data: packages },
  } = useFetchPackages({ ...params });

  const {
    result: { data: sboms },
  } = useFetchSBOMs({ ...params });

  const {
    result: { data: vulnerabilities },
  } = useFetchVulnerabilities({ ...params });

  const tmpArray: IEntity[] = [];

  const transformedAdvisories: IEntity[] = advisories.map((item) => ({
    id: item.document_id,
    title: item.document_id,
    description: item.title?.substring(0, 75),
    navLink: `/advisories/${item.uuid}`,
    type: "Advisory",
    typeColor: "blue",
  }));

  const transformedPackages: IEntity[] = packages.map((item) => ({
    id: item.uuid,
    title: item.purl,
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

  const transformedVulnerabilities: IEntity[] = vulnerabilities.map((item) => ({
    id: item.identifier,
    title: item.identifier,
    description: item.description?.substring(0, 75),
    navLink: `/vulnerabilities/${item.identifier}`,
    type: "Vulnerability",
    typeColor: "orange",
  }));

  tmpArray.push(
    ...transformedAdvisories,
    ...transformedPackages,
    ...transformedSboms,
    ...transformedVulnerabilities
  );

  return {
    list: tmpArray,
    defaultValue: "",
  };
}

export interface ISearchMenu {
  filterFunction?: (
    list: IEntity[],
    searchString: string
  ) => React.JSX.Element[];
  onChangeSearch: (searchValue: string | undefined) => void;
}

export const SearchMenu: React.FC<ISearchMenu> = ({
  filterFunction = filterEntityListByValue,
  onChangeSearch,
}) => {
  const { list: entityList, defaultValue } = useAllEntities("");

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

      const options = filterFunction(entityList, newValue);

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
    <Menu ref={autocompleteRef} style={{ maxWidth: "450px" }}>
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
