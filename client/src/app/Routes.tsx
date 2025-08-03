import { Suspense, lazy } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useParams, useRoutes } from "react-router-dom";

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
  advisoriesDetails: `/advisories/details/:${PathParam.ADVISORY_ID}`,
  vulnerabilitiesList: "/vulnerabilities",
  vulnerabilitiesDetails: `/vulnerabilities/:${PathParam.VULNERABILITY_ID}`,
  sbomsList: "/sboms",
  sbomsDetails: `/sboms/:${PathParam.SBOM_ID}`,
  packagesList: "/packages",
  packagesDetails: `/packages/:${PathParam.PACKAGE_ID}`,
  importersList: "/importers",
  search: "/search",
};

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

export const buildPath = {
  advisoriesDetails: ({ advisoryId }: { advisoryId: string }) => {
    return formatPath(Paths.advisoriesDetails, { advisoryId });
  },
  vulnerabilityDetails: ({ vulnerabilityId }: { vulnerabilityId: string }) => {
    return formatPath(Paths.vulnerabilitiesDetails, { vulnerabilityId });
  },
  sbomsDetails: ({ sbomId }: { sbomId: string }) => {
    return formatPath(Paths.sbomsDetails, { sbomId });
  },
  packageDetails: ({ packageId }: { packageId: string }) => {
    return formatPath(Paths.packagesDetails, { packageId });
  },
};

const formatPath = (path: string, data: Record<string, string | number>) => {
  let url = path as string;

  for (const k of Object.keys(data)) {
    const regex = new RegExp(`:${k}(/|$)`, "g");
    url = url.replace(regex, `${data[k]}$1`);
  }

  return url;
};
