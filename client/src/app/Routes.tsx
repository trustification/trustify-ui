import { Suspense, lazy } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useParams, useRoutes } from "react-router-dom";

import { Bullseye, Spinner } from "@patternfly/react-core";
import { ErrorFallback } from "./components/ErrorFallback";

const Home = lazy(() => import("./pages/home"));

// Advisory
const AdvisoryList = lazy(() => import("./pages/advisory-list"));
const AdvisoryUpload = lazy(() => import("./pages/advisory-upload"));
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
const SBOMUpload = lazy(() => import("./pages/sbom-upload"));
const SBOMcan = lazy(() => import("./pages/sbom-scan"));
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
  advisories: "/advisories",
  advisoryUpload: "/advisories/upload",
  advisoryDetails: `/advisories/:${PathParam.ADVISORY_ID}`,
  vulnerabilities: "/vulnerabilities",
  vulnerabilityDetails: `/vulnerabilities/:${PathParam.VULNERABILITY_ID}`,
  sboms: "/sboms",
  sbomUpload: "/sboms/upload",
  sbomScan: "/sboms/scan",
  sbomDetails: `/sboms/:${PathParam.SBOM_ID}`,
  packages: "/packages",
  packageDetails: `/packages/:${PathParam.PACKAGE_ID}`,
  search: "/search",
  importers: "/importers",
} as const;

export const AppRoutes = () => {
  const allRoutes = useRoutes([
    { path: "/", element: <Home /> },
    { path: Paths.advisories, element: <AdvisoryList /> },
    { path: Paths.advisoryUpload, element: <AdvisoryUpload /> },
    {
      path: Paths.advisoryDetails,
      element: <AdvisoryDetails />,
    },
    { path: Paths.vulnerabilities, element: <VulnerabilityList /> },
    {
      path: Paths.vulnerabilityDetails,
      element: <VulnerabilityDetails />,
    },
    { path: Paths.packages, element: <PackageList /> },
    {
      path: Paths.packageDetails,
      element: <PackageDetails />,
    },
    { path: Paths.sboms, element: <SBOMList /> },
    { path: Paths.sbomUpload, element: <SBOMUpload /> },
    { path: Paths.sbomScan, element: <SBOMcan /> },
    {
      path: Paths.sbomDetails,
      element: <SBOMDetails />,
    },
    {
      path: Paths.importers,
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
