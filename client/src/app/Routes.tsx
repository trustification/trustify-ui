import { Suspense, lazy } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { generatePath, useParams, useRoutes } from "react-router-dom";

import { Bullseye, Spinner } from "@patternfly/react-core";
import { ErrorFallback } from "./components/ErrorFallback";

const Home = lazy(() => import("./pages/home"));

// Advisory
const AdvisoryList = lazy(() => import("./pages/advisory-list"));
const AdvisoryDetails = lazy(() => import("./pages/advisory-details"));

// Vulnerability
const VulnerabilityList = lazy(() => import("./pages/vulnerability-list"));
const VulnerabilityDetails = lazy(
  () => import("./pages/vulnerability-details"),
);

// Package
const PackageList = lazy(() => import("./pages/package-list"));
const PackageDetails = lazy(() => import("./pages/package-details"));

// SBOM
const SBOMList = lazy(() => import("./pages/sbom-list"));
const SBOMDetails = lazy(() => import("./pages/sbom-details"));

// Others
const Search = lazy(() => import("./pages/search"));
const ImporterList = lazy(() => import("./pages/importer-list"));

export enum PathParam {
  ADVISORY_ID = "advisoryId",
  VULNERABILITY_ID = "vulnerabilityId",
  SBOM_ID = "sbomId",
  PACKAGE_ID = "packageId",
}

export const Paths = {
  advisoriesList: "/advisories",
  advisoriesDetails: `/advisories/:${PathParam.ADVISORY_ID}`,
  vulnerabilitiesList: "/vulnerabilities",
  vulnerabilitiesDetails: `/vulnerabilities/:${PathParam.VULNERABILITY_ID}`,
  sbomsList: "/sboms",
  sbomsDetails: `/sboms/:${PathParam.SBOM_ID}`,
  packagesList: "/packages",
  packagesDetails: `/packages/:${PathParam.PACKAGE_ID}`,
  importersList: "/importers",
  search: "/search",
} as const;

export const AppRoutes = () => {
  const allRoutes = useRoutes([
    { path: "/", element: <Home /> },
    { path: Paths.advisoriesList, element: <AdvisoryList /> },
    {
      path: Paths.advisoriesDetails,
      element: <AdvisoryDetails />,
    },
    { path: Paths.vulnerabilitiesList, element: <VulnerabilityList /> },
    {
      path: Paths.vulnerabilitiesDetails,
      element: <VulnerabilityDetails />,
    },
    { path: Paths.packagesList, element: <PackageList /> },
    {
      path: Paths.packagesDetails,
      element: <PackageDetails />,
    },
    { path: Paths.sbomsList, element: <SBOMList /> },
    {
      path: Paths.sbomsDetails,
      element: <SBOMDetails />,
    },
    {
      path: Paths.importersList,
      element: <ImporterList />,
    },
    { path: Paths.search, element: <Search /> },
  ]);

  return (
    <Suspense
      fallback={
        <Bullseye>
          <Spinner />
        </Bullseye>
      }
    >
      <ErrorBoundary FallbackComponent={ErrorFallback} key={location.pathname}>
        {allRoutes}
      </ErrorBoundary>
    </Suspense>
  );
};

export const useRouteParams = (pathParam: PathParam) => {
  const params = useParams();
  const value = params[pathParam];
  if (value === undefined) {
    throw new Error(
      `ASSERTION FAILURE: required path parameter not set: ${pathParam}`,
    );
  }
  return value;
};

/**
 * Given a route string it generates a Type out of it.
 * E.g. "/advisories/:advisoryId" generates the type { advisoryId: string }
 */
type ExtractRouteParams<Path extends string> =
  Path extends `${string}:${infer Param}/${infer Rest}`
    ? { [K in Param | keyof ExtractRouteParams<`/${Rest}`>]: string }
    : Path extends `${string}:${infer Param}`
      ? { [K in Param]: string }
      : // biome-ignore lint/complexity/noBannedTypes: allowed
        {};

export const buildPath = {
  advisoryDetails: (
    params: ExtractRouteParams<typeof Paths.advisoriesDetails>,
  ) => {
    return generatePath(Paths.advisoriesDetails, params);
  },
  vulnerabilityDetails: (
    params: ExtractRouteParams<typeof Paths.vulnerabilitiesDetails>,
  ) => {
    return generatePath(Paths.vulnerabilitiesDetails, params);
  },
  sbomDetails: (params: ExtractRouteParams<typeof Paths.sbomsDetails>) => {
    return generatePath(Paths.sbomsDetails, params);
  },
  packageDetails: (
    params: ExtractRouteParams<typeof Paths.packagesDetails>,
  ) => {
    return generatePath(Paths.packagesDetails, params);
  },
} as const;
