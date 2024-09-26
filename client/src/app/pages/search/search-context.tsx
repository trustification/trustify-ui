import React from "react";
import { PackageSearchProvider } from "../package-list/package-context";
import { SbomSearchProvider } from "../sbom-list/sbom-context";
import { VulnerabilitySearchProvider } from "../vulnerability-list/vulnerability-context";

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
  createProvider(SbomSearchProvider, {}),
  createProvider(PackageSearchProvider, {}),
  createProvider(VulnerabilitySearchProvider, {}),
];

export const SearchProvider = composeProviders(allSearchProviders);
