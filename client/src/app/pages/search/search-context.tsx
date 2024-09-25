import React from "react";
import { PackageSearchProvider } from "../package-list/package-context";
import { SbomSearchProvider } from "../sbom-list/sbom-context";
import { VulnerabilitySearchProvider } from "../vulnerability-list/vulnerability-context";

interface ISearchHeaderContext {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const searchHeaderContextDefaultValue = {} as ISearchHeaderContext;

export const SearchHeaderContext = React.createContext<ISearchHeaderContext>(
  searchHeaderContextDefaultValue
);

interface ISearchHeaderProvider {
  children: React.ReactNode;
}

export const SearchHeaderProvider: React.FunctionComponent<
  ISearchHeaderProvider
> = ({ children }: ISearchHeaderProvider) => {
  const [searchTerm, setSearchTerm] = React.useState("");

  return (
    <SearchHeaderContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
      }}
    >
      {children}
    </SearchHeaderContext.Provider>
  );
};

// Put all required context under only one

interface Provider<TProps> {
  Component: React.ComponentType<React.PropsWithChildren<TProps>>;
  props?: Omit<TProps, "children">;
}

function composeProviders<TProviders extends Array<Provider<any>>>(
  providers: TProviders
): React.ComponentType<React.PropsWithChildren> {
  const ProviderComponent: React.FunctionComponent<React.PropsWithChildren> = ({
    children,
  }) => {
    const initialJSX = <>{children}</>;

    return providers.reduceRight<JSX.Element>(
      (prevJSX, { Component: CurrentProvider, props = {} }) => {
        return <CurrentProvider {...props}>{prevJSX}</CurrentProvider>;
      },
      initialJSX
    );
  };

  return ProviderComponent;
}

function createProvider<TProps>(
  Component: React.ComponentType<React.PropsWithChildren<TProps>>,
  props?: Omit<TProps, "children">
): Provider<TProps> {
  return { Component, props };
}

const allSearchProviders = [
  createProvider(SearchHeaderProvider, {}),
  createProvider(SbomSearchProvider, {}),
  createProvider(PackageSearchProvider, {}),
  createProvider(VulnerabilitySearchProvider, {}),
];

export const SearchProvider = composeProviders(allSearchProviders);
